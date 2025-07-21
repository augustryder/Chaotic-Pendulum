#include <emscripten/bind.h>
#include "Pendulum.h"
#include "Simulation.h"
#include "StateVector.h"

using namespace emscripten;

EMSCRIPTEN_BINDINGS(pendulum_module) {
    // Pendulum class
    class_<Pendulum>("Pendulum")
        .constructor<double, double, double, double>()
        .function("get_angle", &Pendulum::get_angle)
        .function("get_angular_velocity", &Pendulum::get_angular_velocity)
        .function("get_length", &Pendulum::get_length)
        .function("get_mass", &Pendulum::get_mass)
        .function("set_angle", &Pendulum::set_angle)
        .function("set_angular_velocity", &Pendulum::set_angular_velocity)
        .function("set_length", &Pendulum::set_length)
        .function("set_mass", &Pendulum::set_mass)
        .function("configure", &Pendulum::configure);


    // Simulation class
    class_<Simulation>("Simulation")
        .constructor<Pendulum, Pendulum, double>()
        .function("simulate_step", &Simulation::simulate_step)
        .function("get_gravity", &Simulation::get_gravity)
        .function("read_pendulum1", &Simulation::read_pendulum1)
        .function("read_pendulum2", &Simulation::read_pendulum2)
        .function("configure_pendulum1", &Simulation::configure_pendulum1)
        .function("configure_pendulum2", &Simulation::configure_pendulum2);
}