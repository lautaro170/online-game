export class PlayerStats{
    public baseHp = 100;
    public baseMovementSpeed = 10;
    hpMultiplier : number;
    regenSpeed: number;
    damageMultiplier : number;
    rangeMultiplier : number;
    attackSpeedMultiplier : number;
    projectileSpeedMultiplier : number;
    movementSpeedMultiplier : number;
    visionMultiplier : number;
    attackRangeMultiplier : number;
    attackSizeMultiplier : number;

    constructor() {
        this.hpMultiplier = 1;
        this.regenSpeed = 0;
        this.damageMultiplier = 1;
        this.rangeMultiplier = 1;
        this.attackSpeedMultiplier = 1;
        this.projectileSpeedMultiplier = 1;
        this.movementSpeedMultiplier = 1;
        this.visionMultiplier = 1;
        this.attackRangeMultiplier = 1;
        this.attackSizeMultiplier = 1;
    }

    getMovementSpeed(): number {
        return this.baseMovementSpeed * this.movementSpeedMultiplier;
    }
}

/*
* Ideas for stats: damage, critic, range, attack speed, projectile speed ,movement speed, hp, vision, attack range, attack size
* */