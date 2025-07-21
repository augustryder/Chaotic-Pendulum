#pragma once

class Pendulum 
{
public:
    explicit Pendulum(double length, double mass, double angle, double angular_velocity)
    :
    length_(length),
    mass_(mass),
    angle_(angle),
    angular_velocity_(angular_velocity)
    {}
    ~Pendulum() = default;

    double get_angle() const { return angle_; }
    double get_angular_velocity() const { return angular_velocity_; }
    double get_length() const { return length_; }
    double get_mass() const { return mass_; }

    void set_angle(double angle) { angle_ = angle; }
    void set_angular_velocity(double angular_velocity) { angular_velocity_ = angular_velocity; }
    void set_length(double length) { length_ = length; }
    void set_mass(double mass) { mass_ = mass; }

    void configure(double length, double mass, double angle, double angular_velocity)
    {
        length_ = length;
        mass_ = mass;
        angle_ = angle;
        angular_velocity_ = angular_velocity;
    }

private:
    double length_;
    double mass_;
    double angle_;
    double angular_velocity_;

};