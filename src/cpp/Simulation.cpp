#include "Simulation.h"
#include <cmath>
#include "StateVector.h"
#include "Pendulum.h"

StateVector Simulation::calculate_state_derivative(StateVector state) const
{
    const double theta1 = state.theta1;
    const double theta2 = state.theta2;
    const double omega1 = state.omega1;
    const double omega2 = state.omega2;
    const double m1 = pendulum1_.get_mass();
    const double m2 = pendulum2_.get_mass();
    const double l1 = pendulum1_.get_length();
    const double l2 = pendulum2_.get_length();
    const double deltaTheta = theta1 - theta2;
    const double M = m1 + m2;

    // Check website for derivation
    const double g1 = (m2 * l2 * cos(deltaTheta)) / (M * l1);
    const double g2 = (l1 * cos(deltaTheta)) / l2;

    const double f1 = - ((m2 / M) * (l2 / l1) * omega2 * omega2 * sin(deltaTheta)) - (gravity_ * sin(theta1)) / l1;
    const double f2 = (l1 / l2) * (omega1 * omega1) * sin(deltaTheta) - (gravity_ * sin(theta2)) / l2;

    const double h1 = (f1 - g1 * f2) / (1 - g1 * g2);
    const double h2 = (-g2 * f1 + f2) / (1 - g1 * g2);

    return {omega1, omega2, h1, h2};
}

void Simulation::simulate_step(double dt)
{
    const StateVector current_state = {
        pendulum1_.get_angle(),
        pendulum2_.get_angle(),
        pendulum1_.get_angular_velocity(),
        pendulum2_.get_angular_velocity()
    };

    const StateVector k1 = calculate_state_derivative(current_state);
    const StateVector k2 = calculate_state_derivative(current_state + k1 * (dt / 2));
    const StateVector k3 = calculate_state_derivative(current_state + k2 * (dt / 2));
    const StateVector k4 = calculate_state_derivative(current_state + k3 * dt);

    const StateVector ksum = k1 + (k2 * 2) + (k3 * 2) + k4;

    const StateVector new_state = current_state + ksum * (dt / 6);

    pendulum1_.set_angle(new_state.theta1);
    pendulum2_.set_angle(new_state.theta2);
    pendulum1_.set_angular_velocity(new_state.omega1);
    pendulum2_.set_angular_velocity(new_state.omega2);

}