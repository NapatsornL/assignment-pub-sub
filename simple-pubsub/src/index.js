var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
//event
var MachineSaleEvent = /** @class */ (function () {
    function MachineSaleEvent(_sold, _machineId) {
        this._sold = _sold;
        this._machineId = _machineId;
    } // private readonly คือ
    MachineSaleEvent.prototype.machineID = function () {
        return this._machineId; //มาจาก constructor
    };
    MachineSaleEvent.prototype.getSoldQuantity = function () {
        return this._sold; //มาจาก constructor
    };
    MachineSaleEvent.prototype.type = function () {
        return 'sale'; //บอกว่า event ไหน
    };
    return MachineSaleEvent;
}());
var MachineRefillEvent = /** @class */ (function () {
    function MachineRefillEvent(_refill, _machineId) {
        this._refill = _refill;
        this._machineId = _machineId;
    }
    MachineRefillEvent.prototype.machineID = function () {
        return this._machineId;
    };
    MachineRefillEvent.prototype.getRefillQuantity = function () {
        return this._refill; //มาจาก constructor
    };
    MachineRefillEvent.prototype.type = function () {
        return 'refill';
    };
    return MachineRefillEvent;
}());
var LowStockWarningEvent = /** @class */ (function () {
    function LowStockWarningEvent(_machineId) {
        this._machineId = _machineId;
    }
    LowStockWarningEvent.prototype.machineID = function () {
        return this._machineId;
    };
    LowStockWarningEvent.prototype.type = function () {
        return 'low-stock-warning';
    };
    return LowStockWarningEvent;
}());
var StockLevelOkEvent = /** @class */ (function () {
    function StockLevelOkEvent(_machineId) {
        this._machineId = _machineId;
    }
    StockLevelOkEvent.prototype.machineID = function () {
        return this._machineId;
    };
    StockLevelOkEvent.prototype.type = function () {
        return 'stock-level-ok';
    };
    return StockLevelOkEvent;
}());
//subscribe
var MachineSaleSubscriber = /** @class */ (function () {
    function MachineSaleSubscriber(machines, pubSubService) {
        this.machines = machines;
        this.pubSubService = pubSubService;
    }
    MachineSaleSubscriber.prototype.handle = function (event) {
        if (event instanceof MachineSaleEvent) {
            var machine = this.machines.find(function (m) { return m.id === event.machineID(); });
            if (machine) {
                var soldQuantity = event.getSoldQuantity();
                if (machine.stockLevel >= soldQuantity) {
                    machine.stockLevel -= soldQuantity;
                    console.log("Machine ".concat(machine.id, " sold ").concat(soldQuantity, " items. Stock: ").concat(machine.stockLevel, "\n"));
                    if (machine.stockLevel < 3) {
                        this.pubSubService.publish(new LowStockWarningEvent(machine.id));
                    }
                }
                else {
                    console.log("Error: Machine ".concat(machine.id, " does not have enough stock to sell ").concat(soldQuantity, " items. Current stock: ").concat(machine.stockLevel, "\n"));
                }
            }
        }
    };
    return MachineSaleSubscriber;
}());
var MachineRefillSubscriber = /** @class */ (function () {
    function MachineRefillSubscriber(machines, pubSubService) {
        this.machines = machines;
        this.pubSubService = pubSubService;
    }
    MachineRefillSubscriber.prototype.handle = function (event) {
        if (event instanceof MachineRefillEvent) {
            var machine = this.machines.find(function (m) { return m.id === event.machineID(); });
            if (machine) {
                machine.stockLevel += event.getRefillQuantity(); // this.machines[2].stockLevel คือ
                console.log("Machine ".concat(machine.id, " refilled ").concat(event.getRefillQuantity(), " items. Stock: ").concat(machine.stockLevel, "\n"));
                if (machine.stockLevel >= 3) {
                    this.pubSubService.publish(new StockLevelOkEvent(machine.id));
                }
            }
        }
    };
    return MachineRefillSubscriber;
}());
var StockWarningSubscriber = /** @class */ (function () {
    function StockWarningSubscriber() {
    }
    StockWarningSubscriber.prototype.handle = function (event) {
        if (event.type() === 'low-stock-warning') {
            console.log("Warning: Machine ".concat(event.machineID(), " has low stock!"));
        }
        else if (event.type() === 'stock-level-ok') {
            console.log("Info: Machine ".concat(event.machineID(), " stock is now sufficient.\n"));
        }
    };
    return StockWarningSubscriber;
}());
//pubservice 
var PublishSubscribeService = /** @class */ (function () {
    function PublishSubscribeService() {
        this.subscribers = new Map();
    }
    PublishSubscribeService.prototype.subscribe = function (type, handler) {
        if (!this.subscribers.has(type)) {
            this.subscribers.set(type, []);
        }
        this.subscribers.get(type).push(handler);
        console.log("Subscribed to event type: ".concat(type));
    };
    PublishSubscribeService.prototype.unsubscribe = function (type, handler) {
        var handlers = this.subscribers.get(type);
        if (handlers) {
            this.subscribers.set(type, handlers.filter(function (h) { return h !== handler; }));
            console.log("Unsubscribed from event type: ".concat(type));
        }
        else {
            console.log("No subscribers found for event type: ".concat(type));
        }
    };
    PublishSubscribeService.prototype.publish = function (event) {
        var handlers = this.subscribers.get(event.type());
        if (!handlers || handlers.length === 0) {
            console.log("No subscribers found for event type: ".concat(event.type()));
            return;
        }
        console.log("Publishing event type: ".concat(event.type(), " for Machine ID: ").concat(event.machineID()));
        handlers.forEach(function (handler) { return handler.handle(event); });
    };
    return PublishSubscribeService;
}());
//machine
var Machine = /** @class */ (function () {
    function Machine(id) {
        this.stockLevel = 10;
        this.id = id;
    }
    return Machine;
}());
var randomMachine = function () {
    var random = Math.random() * 3;
    if (random < 1) {
        return '001';
    }
    else if (random < 2) {
        return '002';
    }
    return '003';
};
var eventGenerator = function () {
    var random = Math.random();
    if (random < 0.5) {
        var saleQty = Math.random() < 0.5 ? 1 : 2; // 1 or 2
        return new MachineSaleEvent(saleQty, randomMachine());
    }
    var refillQty = Math.random() < 0.5 ? 3 : 5; // 3 or 5
    return new MachineRefillEvent(refillQty, randomMachine());
};
// program
(function () { return __awaiter(_this, void 0, void 0, function () {
    var machines, pubSubService, saleSubscriber, refillSubscriber, warningSubscriber;
    return __generator(this, function (_a) {
        machines = [new Machine("001"), new Machine("002"), new Machine("003")];
        pubSubService = new PublishSubscribeService();
        saleSubscriber = new MachineSaleSubscriber(machines, pubSubService);
        refillSubscriber = new MachineRefillSubscriber(machines, pubSubService);
        warningSubscriber = new StockWarningSubscriber();
        pubSubService.subscribe("sale", saleSubscriber);
        pubSubService.subscribe("refill", refillSubscriber);
        pubSubService.subscribe("low-stock-warning", warningSubscriber);
        pubSubService.subscribe("stock-level-ok", warningSubscriber);
        return [2 /*return*/];
    });
}); })();
