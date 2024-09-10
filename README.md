
# [Chaotic Pendulum Simulation](https://augustherron.com/src/projects/double-pendulum/index.html)

An interactive chaotic pendulum simulation showcasing the double pendulum system and chaotic dynamics.

The double pendulum, or chaotic pendulum, is a system that comprises of a pendulum attached to the end of another pendulum. This system is governed by a set of coupled non-linear ordinary differential equations that cannot be solved analytically. In my simulation I implement fourth-order Runge-Kutta (RK4) integration to numerically solve the differential equations. The website showcases the derivation of the equations of motion using the Lagrangian formalism as well as phase-portraits for the system. 

![Untitled design(1)](https://github.com/user-attachments/assets/c8f38c27-bdeb-42a1-8c65-10e62516a787)

## Theory

The generalized coordinates of the system are the angles of the two rods relative to their vertical. 

The kinetic and potential energy of the system is:
$$T = \frac{1}{2}ML_1^{2}\dot{\theta_1}^{2} + \frac{1}{2}m_2L_2^{2}\dot{\theta_2}^{2} + m_2L_1L_2\dot{\theta_1}\dot{\theta_2}\cos\Delta\theta$$
$$U = -MgL_1\cos\theta_1 - m_2gL_2\cos\theta_2$$

The [Lagrangian](https://augustherron.com/src/projects/double-pendulum/index.html) of the system is:

$$\mathcal{L} = \frac{1}{2}ML_1^{2}\dot{\theta_1}^{2} + \frac{1}{2}m_2L_2^{2}\dot{\theta_2}^{2} + m_2L_1L_2\dot{\theta_1}\dot{\theta_2}\cos\Delta\theta + MgL_1\cos\theta_1 + m_2gL_2\cos\theta_2$$

We then apply the Euler-Lagrange equation to our generalized coordinates:
$$\frac{\partial L}{\partial q} - \frac{d}{dt} \left(\frac{\partial L}{\partial \dot{q}}\right) = 0$$

After applying the Euler-Lagrange equation we do some simplifying (that you can see on the website) to arrive at our equations of motion. The equations of motion are a set of coupled non-linear ODEs and have NO analytical solution :crying_cat_face:. Thus, they must be solved via numerical methods. In my simulation I use fourth-order Runge-Kutta (RK4) integration. 
