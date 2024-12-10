export class CooldownComponent{
    cooldown: number;
    lastUsed: number;
    constructor(cooldown: number, lastUsed: number = 0){
        this.cooldown = cooldown;
        this.lastUsed = lastUsed;
    }
    use(){
        this.lastUsed = Date.now();
    }
    canUse(){
        return Date.now() - this.lastUsed >= this.cooldown;
    }
}