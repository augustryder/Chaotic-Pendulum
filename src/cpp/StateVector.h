#pragma once

struct StateVector 
{
    double theta1, theta2;
    double omega1, omega2;

    StateVector() = default;
    StateVector(double t1, double t2, double o1, double o2)
    :
    theta1(t1),
    theta2(t2),
    omega1(o1),
    omega2(o2)
    {}

    StateVector operator+(const StateVector& other) const
    {
        return StateVector(theta1 + other.theta1, theta2 + other.theta2, omega1 + other.omega1, omega2 + other.omega2);
    }

    StateVector operator-(const StateVector& other) const
    {
        return StateVector(theta1 - other.theta1, theta2 - other.theta2, omega1 - other.omega1, omega2 - other.omega2);
    }

    StateVector operator*(double scalar) const
    {
        return StateVector(theta1 * scalar, theta2 * scalar, omega1 * scalar, omega2 * scalar);
    }

    StateVector operator/(double scalar) const
    {
        return StateVector(theta1 / scalar, theta2 / scalar, omega1 / scalar, omega2 / scalar);
    }

};