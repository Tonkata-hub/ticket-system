import "server-only";

/**
 * In-memory rate limiter using Map storage
 * Tracks attempts by identifier (typically IP address)
 */

class RateLimiter {
    constructor() {
        this.attempts = new Map();
        // Cleanup expired entries every 2 minutes
        this.cleanupInterval = setInterval(() => this.cleanup(), 120000);
    }

    /**
     * Check if identifier has exceeded rate limit
     * @param {string} identifier - Usually IP address
     * @param {number} maxAttempts - Maximum attempts allowed (default: 5)
     * @param {number} windowMs - Time window in milliseconds (default: 60000 = 1 minute)
     * @returns {Object} { allowed: boolean, remaining: number, resetTime: Date|null }
     */
    check(identifier, maxAttempts = 5, windowMs = 60000) {
        const now = Date.now();
        const record = this.attempts.get(identifier);

        // No record exists, first attempt
        if (!record) {
            this.attempts.set(identifier, {
                count: 1,
                firstAttempt: now,
                expiresAt: now + windowMs,
            });
            return { allowed: true, remaining: maxAttempts - 1, resetTime: null };
        }

        // Record expired, reset it
        if (now > record.expiresAt) {
            this.attempts.set(identifier, {
                count: 1,
                firstAttempt: now,
                expiresAt: now + windowMs,
            });
            return { allowed: true, remaining: maxAttempts - 1, resetTime: null };
        }

        // Record still valid, check if limit exceeded
        if (record.count >= maxAttempts) {
            return {
                allowed: false,
                remaining: 0,
                resetTime: new Date(record.expiresAt),
            };
        }

        // Increment count
        record.count++;
        this.attempts.set(identifier, record);

        return {
            allowed: true,
            remaining: maxAttempts - record.count,
            resetTime: record.count >= maxAttempts ? new Date(record.expiresAt) : null,
        };
    }

    /**
     * Reset rate limit for an identifier
     * @param {string} identifier - Usually IP address
     */
    reset(identifier) {
        this.attempts.delete(identifier);
    }

    /**
     * Clean up expired entries
     */
    cleanup() {
        const now = Date.now();
        for (const [identifier, record] of this.attempts.entries()) {
            if (now > record.expiresAt) {
                this.attempts.delete(identifier);
            }
        }
    }

    /**
     * Get current attempt count for identifier
     * @param {string} identifier - Usually IP address
     * @returns {number} Current attempt count
     */
    getAttemptCount(identifier) {
        const record = this.attempts.get(identifier);
        if (!record || Date.now() > record.expiresAt) {
            return 0;
        }
        return record.count;
    }
}

// Singleton instance
const loginRateLimiter = new RateLimiter();

export default loginRateLimiter;

