
const PI_2 = 2 * Math.PI;

export const presets = {
    'Chaotic': {
        pendulum1Config: {
            length: 150,
            mass: 100,
            angle: (120/360) * PI_2,
            angularVelocity: 0
        },
        pendulum2Config: {
            length: 150,
            mass: 100,
            angle: (60/360) * PI_2,
            angularVelocity: 0
        }
    },
    'Periodic': {
        pendulum1Config: {
            length: 150,
            mass: 100,
            angle: (5/360) * PI_2,
            angularVelocity: 0
        },
        pendulum2Config: {
            length: 150,
            mass: 100,
            angle: (-15/360) * PI_2,
            angularVelocity: 0
        }
    },
    'Big-Small': {
        pendulum1Config: {
            length: 150,
            mass: 250,
            angle: Math.PI/2,
            angularVelocity: 0
        },
        pendulum2Config: {
            length: 150,
            mass: 30,
            angle: Math.PI/2,
            angularVelocity: 0
        }
    },
    'Small-Big': {
        pendulum1Config: {
            length: 150,
            mass: 30,
            angle: Math.PI/2,
            angularVelocity: 0
        },
        pendulum2Config: {
            length: 150,
            mass: 250,
            angle: Math.PI/2,
            angularVelocity: 0
        }
    },
    '60-30': {
        pendulum1Config: {
            length: 150,
            mass: 100,
            angle: (60/360) * PI_2,
            angularVelocity: 0
        },
        pendulum2Config: {
            length: 150,
            mass: 100,
            angle: (30/360) * PI_2,
            angularVelocity: 0
        }
    },
    '90-90': {
        pendulum1Config: {
            length: 150,
            mass: 100,
            angle: Math.PI/2,
            angularVelocity: 0
        },
        pendulum2Config: {
            length: 150,
            mass: 100,
            angle: Math.PI/2,
            angularVelocity: 0
        }
    },
    '45-45': {
        pendulum1Config: {
            length: 150,
            mass: 100,
            angle: Math.PI/4,
            angularVelocity: 0
        },
        pendulum2Config: {
            length: 150,
            mass: 100,
            angle: Math.PI/4,
            angularVelocity: 0
        }
    },
    'Default': {
        pendulum1Config: {
            length: 150,
            mass: 100,
            angle: Math.PI / 2,
            angularVelocity: 0
        },
        pendulum2Config: {
            length: 150,
            mass: 100,
            angle: Math.PI / 2,
            angularVelocity: 0
        }
    }
}