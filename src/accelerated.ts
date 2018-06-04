import debounce = require('lodash.debounce');

export interface AcceleratedOptions {
    accelerationTable: number[];
    resetTime: number;
    commandMode: string;
    executeCommand: (command: string, args: any) => Promise<void>;
    onError: (e: Error) => void;
}

export class Accelerated {
    options: AcceleratedOptions;
    keyCount: number = 0;

    constructor(options: AcceleratedOptions) {
        this.options = options;
        this.scheduleReset = debounce(() => this.keyCount = 0, options.resetTime);
    }

    private scheduleReset: (() => void) & { cancel(): void, flush(): void };

    up() {
        this.increment();
        this.executeCommand('up').catch(e => this.options.onError(e));
    }

    down() {
        this.increment();
        this.executeCommand('down').catch(e => this.options.onError(e));
    }

    dispose() {
        this.scheduleReset.cancel();
    }

    private executeCommand(direction: 'up' | 'down'): Promise<any> {
        const { commandMode, executeCommand } = this.options;
        const count = this.calculateCount();
        switch (commandMode) {
            default:
            case 'vscodevim': {
                const motion = `<${direction}>`
                const after = count >= 2 ? [count.toString(), motion] : [motion];
                return executeCommand('vim.remap', { after });
            }
            case 'vscodevim-gj-gk': {
                const motion = direction === 'down' ? 'j' : 'k';
                const after = count >= 2 ? [count.toString(), 'g', motion] : ['g', motion];
                return executeCommand('vim.remap', { after });
            }
            case 'cursormove':
                return executeCommand('cursorMove', { to: direction, value: count });
        }
    }

    private calculateCount(): number {
        const table = this.options.accelerationTable;
        // Given table [7, 12, ...] and keyCount = 7 then next index is 12.
        const nextIndex = table.findIndex(repeat => this.keyCount < repeat);
        return (nextIndex < 0 ? table.length : nextIndex) + 1;
    }

    private increment() {
        this.keyCount++;
        this.scheduleReset();
    }
}
