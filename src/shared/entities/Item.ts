import {CooldownComponent} from "./components/CooldownComponent";

export class Item {
    name: string;
    cooldownComponent: CooldownComponent = new CooldownComponent(0, 0);

    constructor(name: string) {
        this.name = name;
    }

    setCooldown(cooldown: number, lastUsed: number = 0) {
        this.cooldownComponent = new CooldownComponent(cooldown, lastUsed);
    }

    use() {
        console.log(this.getLastUsed())
        this.cooldownComponent.use();
        console.log(this.getLastUsed());
    }

    canUse(): boolean {
        return this.cooldownComponent.canUse() ?? false;
    }

    getCooldown(): number {
        return this.cooldownComponent.cooldown ?? 0;
    }
    getLastUsed(): number {
        return this.cooldownComponent.lastUsed ?? null;
    }

}