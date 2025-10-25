import { Link } from 'react-router-dom';
import { Building, Users, BarChart3, ShieldCheck, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const LandingPage = () => {
  const features = [
    {
      icon: Building,
      title: 'Hostel Management',
      description: 'Streamline complaint handling across multiple hostel blocks with organized tracking.'
    },
    {
      icon: Users,
      title: 'Role-based Access',
      description: 'Different interfaces for students, wardens, and administrators with appropriate permissions.'
    },
    {
      icon: BarChart3,
      title: 'Analytics Dashboard',
      description: 'Comprehensive insights and reports on complaint trends and resolution rates.'
    },
    {
      icon: ShieldCheck,
      title: 'Secure & Reliable',
      description: 'Built with modern security practices to ensure data protection and privacy.'
    }
  ];

  return (
    <div className="min-h-screen gradient-bg">
      {/* Navigation */}
      <nav className="bg-white/95 backdrop-blur-sm shadow-soft sticky top-0 z-50">
        <div className="container-custom">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-600 to-primary-700 rounded-xl flex items-center justify-center shadow-soft">
                <span className="text-white font-bold text-lg">HS</span>
              </div>
              <div>
                <span className="font-bold text-secondary-900 text-2xl">HostelSync</span>
                <p className="text-xs text-secondary-500 -mt-1">Complaint Management System</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link
                to="/signup"
                className="btn-ghost px-4 py-2"
              >
                Sign Up
              </Link>
              <div className="relative group">
                <button className="btn-primary px-6 py-2">
                  Login
                </button>
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-large border border-secondary-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 overflow-hidden">
                  <div className="py-2">
                    <Link
                      to="/login/student"
                      className="block px-4 py-3 text-sm text-secondary-700 hover:bg-primary-50 hover:text-primary-700 transition-colors duration-200 flex items-center space-x-3"
                    >
                      <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                        <span className="text-primary-600 font-semibold text-xs">S</span>
                      </div>
                      <div>
                        <p className="font-medium">Student Login</p>
                        <p className="text-xs text-secondary-500">Access student portal</p>
                      </div>
                    </Link>
                    <Link
                      to="/login/warden"
                      className="block px-4 py-3 text-sm text-secondary-700 hover:bg-warning-50 hover:text-warning-700 transition-colors duration-200 flex items-center space-x-3"
                    >
                      <div className="w-8 h-8 bg-warning-100 rounded-lg flex items-center justify-center">
                        <span className="text-warning-600 font-semibold text-xs">W</span>
                      </div>
                      <div>
                        <p className="font-medium">Warden Login</p>
                        <p className="text-xs text-secondary-500">Manage complaints</p>
                      </div>
                    </Link>
                    <Link
                      to="/login/admin"
                      className="block px-4 py-3 text-sm text-secondary-700 hover:bg-success-50 hover:text-success-700 transition-colors duration-200 flex items-center space-x-3"
                    >
                      <div className="w-8 h-8 bg-success-100 rounded-lg flex items-center justify-center">
                        <span className="text-success-600 font-semibold text-xs">A</span>
                      </div>
                      <div>
                        <p className="font-medium">Admin Login</p>
                        <p className="text-xs text-secondary-500">System administration</p>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="section-padding">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="max-w-4xl mx-auto">
              <h1 className="text-5xl lg:text-6xl font-bold text-secondary-900 mb-6 leading-tight">
                Simplify Hostel
                <span className="text-gradient block"> Complaint Management</span>
              </h1>
              <p className="text-xl text-secondary-600 mb-8 max-w-3xl mx-auto leading-relaxed">
                A comprehensive solution for managing hostel complaints efficiently. 
                Streamline communication between students, wardens, and administrators 
                with our intuitive platform.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <Link
                  to="/signup"
                  className="btn-primary px-8 py-4 text-lg font-semibold inline-flex items-center"
                >
                  Get Started
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
                <button className="btn-outline px-8 py-4 text-lg font-semibold">
                  Learn More
                </button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary-600 mb-2">500+</div>
                  <div className="text-secondary-600">Active Users</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-success-600 mb-2">95%</div>
                  <div className="text-secondary-600">Resolution Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-accent-600 mb-2">24/7</div>
                  <div className="text-secondary-600">Support Available</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-secondary-900 mb-4">
              Everything You Need for Effective Management
            </h2>
            <p className="text-lg text-secondary-600 max-w-2xl mx-auto">
              Powerful features designed to streamline your hostel operations and enhance communication
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="card-hover p-8 text-center group"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-primary-100 to-primary-200 rounded-2xl flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-secondary-900 mb-3">{feature.title}</h3>
                <p className="text-secondary-600 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-gradient-to-br from-primary-600 to-primary-700 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container-custom relative">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Transform Your Hostel Management?
            </h2>
            <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
              Join hundreds of hostels already using HostelSync to improve their operations and enhance student satisfaction.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/signup"
                className="inline-flex items-center px-8 py-4 bg-white text-primary-600 font-semibold rounded-xl hover:bg-primary-50 transition-colors shadow-large"
              >
                Start Your Journey
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <button className="btn-outline border-white text-white hover:bg-white hover:text-primary-600 px-8 py-4 text-lg font-semibold">
                Schedule Demo
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-secondary-900 text-white py-16">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-600 to-primary-700 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-lg">HS</span>
                </div>
                <div>
                  <span className="font-bold text-2xl">HostelSync</span>
                  <p className="text-secondary-400 text-sm">Complaint Management System</p>
                </div>
              </div>
              <p className="text-secondary-400 mb-6 max-w-md">
                Streamline your hostel operations with our comprehensive complaint management platform designed for modern educational institutions.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-white mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link to="/signup" className="text-secondary-400 hover:text-white transition-colors">Sign Up</Link></li>
                <li><Link to="/login/student" className="text-secondary-400 hover:text-white transition-colors">Student Login</Link></li>
                <li><Link to="/login/warden" className="text-secondary-400 hover:text-white transition-colors">Warden Login</Link></li>
                <li><Link to="/login/admin" className="text-secondary-400 hover:text-white transition-colors">Admin Login</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-white mb-4">Support</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-secondary-400 hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="text-secondary-400 hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="text-secondary-400 hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="text-secondary-400 hover:text-white transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-secondary-800 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-secondary-400 text-sm">
                © 2024 HostelSync. All rights reserved.
              </p>
              <div className="flex space-x-4 mt-4 md:mt-0">
                <a href="#" className="text-secondary-400 hover:text-white transition-colors">Twitter</a>
                <a href="#" className="text-secondary-400 hover:text-white transition-colors">LinkedIn</a>
                <a href="#" className="text-secondary-400 hover:text-white transition-colors">GitHub</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;