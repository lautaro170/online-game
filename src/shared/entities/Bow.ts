export class Bow {
    static baseRange: number = 300;
    static baseDamage: number = 15;
    static baseCooldown: number = 1000; // in milliseconds

    private lastShotTime: number = 0;

    canShoot(): boolean {
        const currentTime = Date.now();
        if (currentTime - this.lastShotTime >= Bow.baseCooldown) {
            this.lastShotTime = currentTime;
            return true;
        }
        return false;
    }
}