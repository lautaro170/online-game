class CollisionService {
    static checkCollision(entity1, entity2): boolean {
        // Simple AABB collision detection
        return entity1.x < entity2.x + entity2.width &&
            entity1.x + entity1.width > entity2.x &&
            entity1.y < entity2.y + entity2.height &&
            entity1.y + entity1.height > entity2.y;
    }

    static handlePlayerProjectileCollision(player, projectile) {
        if (this.checkCollision(player, projectile)) {
            player.currentHp -= projectile.damage;
            projectile.destroy();
            if (player.currentHp <= 0) {
                player.respawn();
            }
        }
    }

    static handlePlayerWallCollision(player, wall) {
        if (this.checkCollision(player, wall)) {
            // Handle player-wall collision (e.g., stop player movement)
        }
    }

    static handleProjectileWallCollision(projectile, wall) {
        if (this.checkCollision(projectile, wall)) {
            projectile.destroy();
            wall.takeDamage(projectile.damage);
        }
    }
}