//interface
interface IEvent{
    type() : string;
    machineID() : string; // ()แปลว่าไร
}

interface ISubscriber{
    handle(event: IEvent) : void; // handle - คืออะไร
}

interface IPublishSubscribeService{
    publish (event: IEvent) : void;
    subscribe(type: string, handler: ISubscriber) : void;
    //unsubscribe (/question 2 - build this features)
    unsubscribe(type: string, handler: ISubscriber): void;

}

//event
class MachineSaleEvent implements IEvent{
    constructor(private readonly _sold: number, private readonly _machineId: string){} // private readonly คือ

    machineID(): string {
        return this._machineId //มาจาก constructor
    }

    getSoldQuantity(): number{
        return this._sold //มาจาก constructor
    }

    type(): string{
        return 'sale'; //บอกว่า event ไหน
    }
}

class MachineRefillEvent implements IEvent{
    constructor(private readonly _refill: number, private readonly _machineId: string){}

    machineID(): string {
        return this._machineId
    }
    getRefillQuantity(): number{
        return this._refill //มาจาก constructor
    }
    type(): string {
        return 'refill';
    }

    //add ว่า ถ้า level ของ stock น้อยกว่า 3 ให้เพิ่มสต็อค
}

class LowStockWarningEvent implements IEvent {
    constructor(private readonly _machineId: string) {}

    machineID(): string {
        return this._machineId
    }

    type(): string {
        return 'low-stock-warning'
    }
  }
  
  class StockLevelOkEvent implements IEvent {
    constructor(private readonly _machineId: string) {}

    machineID(): string {
        return this._machineId
    }

    type(): string {
        return 'stock-level-ok'
    }
  }

//subscribe
class MachineSaleSubscriber implements ISubscriber {
    constructor(private machines: Machine[], private pubSubService: IPublishSubscribeService) {}

    handle(event: IEvent): void {
        if (event instanceof MachineSaleEvent) {
            const machine = this.machines.find((m) => m.id === event.machineID());
            if (machine) {
                const soldQuantity = event.getSoldQuantity();
                if (machine.stockLevel >= soldQuantity) {
                    machine.stockLevel -= soldQuantity;
                    console.log(`Machine ${machine.id} sold ${soldQuantity} items. Stock: ${machine.stockLevel}\n`);

                    if (machine.stockLevel < 3) {
                        this.pubSubService.publish(new LowStockWarningEvent(machine.id));
                    }
                } else {
                    console.log(
                        `Error: Machine ${machine.id} does not have enough stock to sell ${soldQuantity} items. Current stock: ${machine.stockLevel}\n`
                    );
                }
            }
        }
    }
}

class MachineRefillSubscriber implements ISubscriber{
    constructor(private machines: Machine[], private pubSubService: IPublishSubscribeService){}
    handle(event: IEvent): void {
        if(event instanceof MachineRefillEvent){
            const machine = this.machines.find((m) => m.id === event.machineID());
            if(machine) {
                machine.stockLevel += event.getRefillQuantity(); // this.machines[2].stockLevel คือ
                console.log(`Machine ${machine.id} refilled ${event.getRefillQuantity()} items. Stock: ${machine.stockLevel}\n`);

                if(machine.stockLevel >= 3) { this.pubSubService.publish(new StockLevelOkEvent(machine.id)); }
            }
        }
    }
}

class StockWarningSubscriber implements ISubscriber {
    handle(event: IEvent): void {
      if (event.type() === 'low-stock-warning') {
        console.log(`Warning: Machine ${event.machineID()} has low stock!`);
      } else if (event.type() === 'stock-level-ok') {
        console.log(`Info: Machine ${event.machineID()} stock is now sufficient.\n`);
      }
    }
}

//pubservice 
class PublishSubscribeService implements IPublishSubscribeService {
    private subscribers: Map<string, ISubscriber[]> = new Map();

    subscribe(type: string, handler: ISubscriber): void {
        if (!this.subscribers.has(type)) {
            this.subscribers.set(type, []);
        }
        this.subscribers.get(type)!.push(handler);
        console.log(`Subscribed to event type: ${type}`);
    }

    unsubscribe(type: string, handler: ISubscriber): void {
        const handlers = this.subscribers.get(type);
        if (handlers) {
            this.subscribers.set(
                type,
                handlers.filter((h) => h !== handler)
            );
            console.log(`Unsubscribed from event type: ${type}`);
        } else {
            console.log(`No subscribers found for event type: ${type}`);
        }
    }

    publish(event: IEvent): void {
        const handlers = this.subscribers.get(event.type());
        if (!handlers || handlers.length === 0) {
            console.log(`No subscribers found for event type: ${event.type()}`);
            return;
        }
        console.log(`Publishing event type: ${event.type()} for Machine ID: ${event.machineID()}`);
        handlers.forEach((handler) => handler.handle(event));
    }
}

//machine
class Machine{
    public stockLevel = 10;
    public id: string;

    constructor(id: string){
        this.id = id;
    }
}

const randomMachine = (): string => {
    const random = Math.random() * 3;
    if (random < 1) {
      return '001';
    } else if (random < 2) {
      return '002';
    }
    return '003';
  
  }

const eventGenerator = (): IEvent => {
    const random = Math.random();
    if (random < 0.5) {
      const saleQty = Math.random() < 0.5 ? 1 : 2; // 1 or 2
      return new MachineSaleEvent(saleQty, randomMachine());
    } 
    const refillQty = Math.random() < 0.5 ? 3 : 5; // 3 or 5
    return new MachineRefillEvent(refillQty, randomMachine());
  }

  // program
  (async () => {
    // create 3 machines with a quantity of 10 stock
    const machines: Machine[] = [new Machine("001"), new Machine("002"), new Machine("003")];
    // create the PubSub service
    const pubSubService = new PublishSubscribeService();
    // create a machine sale event subscriber. inject the machines (all subscribers should do this)
    const saleSubscriber = new MachineSaleSubscriber(machines, pubSubService);
    const refillSubscriber = new MachineRefillSubscriber(machines, pubSubService);
    const warningSubscriber = new StockWarningSubscriber();
    pubSubService.subscribe("sale", saleSubscriber);
    pubSubService.subscribe("refill", refillSubscriber);
    pubSubService.subscribe("low-stock-warning", warningSubscriber);
    pubSubService.subscribe("stock-level-ok", warningSubscriber);

    // console.log("--- Test Case 1: Publish Sale Event ---");
    // pubSubService.publish(new MachineSaleEvent(2, "001"));

    // console.log("--- Test Case 2: Publish Refill Event ---");
    // pubSubService.publish(new MachineRefillEvent(5, "001"));

    // console.log("--- Test Case 3: Low Stock Warning ---");
    // pubSubService.publish(new MachineSaleEvent(21, "002"));

    // console.log("--- Test Case 4: Stock Level OK ---");
    // pubSubService.publish(new MachineRefillEvent(10, "002"));

    // console.log("--- Test Case 5: Unsubscribe Sale Subscriber ---");
    // pubSubService.unsubscribe("sale", saleSubscriber);
    // pubSubService.publish(new MachineSaleEvent(1, "003"));

    // console.log("--- Test Case 6: Subscribe After Publish ---");
    // pubSubService.publish(new MachineSaleEvent(1, "003")); // No output for "sale"
    // pubSubService.subscribe("sale", saleSubscriber);
    // pubSubService.publish(new MachineSaleEvent(1, "003"));
})();