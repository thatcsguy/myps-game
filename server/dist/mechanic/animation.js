"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnimationKey = exports.Animation = void 0;
const mechanic_1 = require("./mechanic");
class Animation extends mechanic_1.Mechanic {
    constructor(key, drawPriority, options) {
        super();
        this.id = mechanic_1.MechanicId.ANIMATION;
        this.key = key;
        this.dp = drawPriority;
        this.options = options;
    }
    process(gameState, index) {
        super.process(gameState, index);
        if (gameState.now >= this.start + this.duration) {
            gameState.cleanupMechanic(index);
        }
    }
}
exports.Animation = Animation;
var AnimationKey;
(function (AnimationKey) {
    AnimationKey[AnimationKey["SETTING_THE_SCENE"] = 0] = "SETTING_THE_SCENE";
    AnimationKey[AnimationKey["ROTATION_MARKER"] = 1] = "ROTATION_MARKER";
})(AnimationKey = exports.AnimationKey || (exports.AnimationKey = {}));
//# sourceMappingURL=animation.js.map