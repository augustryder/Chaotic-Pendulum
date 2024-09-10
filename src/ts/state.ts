// theta1, theta2, omega1, omega2
export type State = [number, number, number, number];

export function addStates(x: State, y: State) : State {
	return [x[0] + y[0], x[1] + y[1], x[2] + y[2], x[3] + y[3]]
}

export function multiplyState(x: State, c: number) : State {
    return [c * x[0], c * x[1], c * x[2], c * x[3]]
}
