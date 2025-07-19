#pragma once
#include <vector>
#include "Pendulum.h"
#include "StateVector.h"

class Simulation {
public:
    Simulation(Pendulum pendulum1, Pendulum pendulum2, double gravity)
    :
    pendulum1_(pendulum1),
    pendulum2_(pendulum2),
    gravity_(gravity)
    {}
    ~Simulation() = default;

    void simulate_step(double dt);

    double get_gravity() const { return gravity_; }
    Pendulum& get_pendulum1() { return pendulum1_; }
    Pendulum& get_pendulum2() { return pendulum2_; }
    const Pendulum& read_pendulum1() const { return pendulum1_; }
    const Pendulum& read_pendulum2() const { return pendulum2_; }

private:
    Pendulum pendulum1_;
    Pendulum pendulum2_;
    double gravity_;

    StateVector calculate_state_derivative(StateVector state) const;

};