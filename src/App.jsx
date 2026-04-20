import React, { useState, useEffect, useRef } from 'react';
import feather from 'feather-icons';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [loadingText, setLoadingText] = useState('');
  const [heroText, setHeroText] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hideLoadingScreen, setHideLoadingScreen] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [formStatus, setFormStatus] = useState('idle');

  const loadingStr = "WELCOME TO MY PORTFOLIO WEBSITE";
  const heroStr = "Chris Niño G. Pagente";

  // Initialize feather icons
  useEffect(() => {
    feather.replace();
  }, [isLoading, hideLoadingScreen, formStatus]);

  // Loading Screen Animation
  useEffect(() => {
    let currentText = '';
    let i = 0;
    
    // Tiny pause before starting to type
    const initialDelay = setTimeout(() => {
      const intervalId = setInterval(() => {
        if (i < loadingStr.length) {
          currentText += loadingStr.charAt(i);
          setLoadingText(currentText);
          i++;
          setLoadingProgress(Math.floor((i / loadingStr.length) * 100));
        } else {
          clearInterval(intervalId);
          // Wait 1s after typing finishes before animating opacity
          setTimeout(() => {
            setIsLoading(false);
            // Wait another second before removing from DOM
            setTimeout(() => {
              setHideLoadingScreen(true);
              document.body.classList.remove('overflow-hidden');
            }, 1000);
          }, 1000);
        }
      }, 50);

      return () => clearInterval(intervalId);
    }, 500);

    return () => clearTimeout(initialDelay);
  }, []);

  // Hero Text Loop Animation
  useEffect(() => {
    if (isLoading) return;

    let i = 0;
    let isDeleting = false;
    let timeoutId;
    let currentText = '';

    const typeWriterLoop = () => {
      if (!isDeleting) {
        currentText = heroStr.substring(0, i + 1);
        setHeroText(currentText);
        i++;
        
        if (i === heroStr.length) {
          isDeleting = true;
          timeoutId = setTimeout(typeWriterLoop, 2000); // delay before backspacing
        } else {
          timeoutId = setTimeout(typeWriterLoop, 100); // typing speed
        }
      } else {
        currentText = heroStr.substring(0, i - 1);
        setHeroText(currentText);
        i--;
        
        if (i === 0) {
          isDeleting = false;
          timeoutId = setTimeout(typeWriterLoop, 1000); // delay before re-typing
        } else {
          timeoutId = setTimeout(typeWriterLoop, 50); // erase speed
        }
      }
    };

    // Start Hero text typing after a short delay once loading screen fades
    const initialDelay = setTimeout(typeWriterLoop, 500);

    return () => {
      clearTimeout(timeoutId);
      clearTimeout(initialDelay);
    };
  }, [isLoading]);

  // Flowise Chatbot Initializer
  useEffect(() => {
    if (hideLoadingScreen) {
      const script = document.createElement('script');
      script.type = 'module';
      script.innerHTML = `
        import Chatbot from "https://cdn.jsdelivr.net/npm/flowise-embed/dist/web.js";
        Chatbot.init({
            chatflowid: "06ab5077-6744-4d72-93cf-d1978bd9e87d",
            apiHost: "https://cloud.flowiseai.com",
            theme: {
              button: {
                  backgroundColor: "#ff0000",
                  right: 20,
                  bottom: 20,
                  size: 56,
                  iconColor: "white"
              },
              chatWindow: {
                  welcomeMessage: "Hello! How can I help you today?",
                  backgroundColor: "#111111",
                  height: 600,
                  width: 400,
                  fontSize: 16,
                  poweredByTextColor: "#555555",
                  botMessage: {
                      backgroundColor: "#222222",
                      textColor: "#ffffff",
                      showAvatar: true
                  },
                  userMessage: {
                      backgroundColor: "#ff0000",
                      textColor: "#ffffff",
                      showAvatar: false
                  },
                  textInput: {
                      placeholder: "Type your message...",
                      backgroundColor: "#1a1a1a",
                      textColor: "#ffffff",
                      sendButtonColor: "#ff0000",
                      autoFocus: true,
                      sendMessageSound: true,
                      receiveMessageSound: true
                  }
              }
            }
        });
      `;
      document.body.appendChild(script);

      return () => {
        if (script.parentNode) {
          script.parentNode.removeChild(script);
        }
        // Also remove the custom element created by Flowise if it exists
        const chatbotEl = document.querySelector('flowise-chatbot');
        if (chatbotEl && chatbotEl.parentNode) {
          chatbotEl.parentNode.removeChild(chatbotEl);
        }
      };
    }
  }, [hideLoadingScreen]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormStatus('submitting');
    
    const formData = new FormData(e.target);
    
    try {
      const response = await fetch('https://formsubmit.co/ajax/Chrisninopagente2@gmail.com', {
        method: 'POST',
        headers: {
            'Accept': 'application/json'
        },
        body: formData
      });
      
      if (response.ok) {
        setFormStatus('success');
        e.target.reset(); // clear the form
        setTimeout(() => setFormStatus('idle'), 5000); // revert to idle after 5 seconds
      } else {
        setFormStatus('error');
        setTimeout(() => setFormStatus('idle'), 5000);
      }
    } catch (error) {
      setFormStatus('error');
      setTimeout(() => setFormStatus('idle'), 5000);
    }
  };

  return (
    <>
      {/* LOADING SCREEN */}
      {!hideLoadingScreen && (
        <div
          className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-darkBg transition-opacity duration-1000 ${
            !isLoading ? 'opacity-0' : 'opacity-100'
          }`}
        >
          <div className="flex space-x-6 mb-8 text-redTheme">
            <i data-feather="code" className="loading-icon w-8 h-8 md:w-10 md:h-10"></i>
            <i data-feather="database" className="loading-icon w-8 h-8 md:w-10 md:h-10"></i>
            <i data-feather="zap" className="loading-icon w-8 h-8 md:w-10 md:h-10"></i>
          </div>
          <div className="h-8 md:h-12 w-full flex justify-center items-center mb-10 px-4">
            <h1
              className="text-xl md:text-3xl font-semibold tracking-[0.2em] text-redTheme uppercase text-center"
              style={{ filter: 'drop-shadow(0 0 5px rgba(255, 0, 0, 0.5))' }}
            >
              {loadingText}
            </h1>
            <span className="cursor"></span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-64 md:w-80 h-1 bg-gray-800 rounded overflow-hidden mb-3">
              <div
                className="h-full bg-redTheme transition-all duration-[50ms] shadow-[0_0_10px_#ff0000] relative ease-linear"
                style={{ width: `${loadingProgress}%` }}
              >
                <div className="absolute right-0 top-0 bottom-0 w-2 bg-white blur-[2px] opacity-80"></div>
              </div>
            </div>
            <div className="text-gray-400 text-sm md:text-base font-mono tracking-[0.1em] font-semibold flex items-center">
              LOADING <span className="text-redTheme w-12 text-right ml-1">{loadingProgress}%</span>
            </div>
          </div>
        </div>
      )}

      {/* MAIN PORTFOLIO */}
      {hideLoadingScreen && (
        <div className="min-h-screen flex flex-col w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 opacity-100 transition-opacity duration-1000 animate-[fadeIn_1s_ease-in]">
          {/* Navigation */}
          <nav className="flex justify-between items-center py-6">
            <a href="#" className="text-2xl md:text-3xl font-bold text-redTheme tracking-wide" style={{ textShadow: '0 0 10px rgba(255,0,0,0.4)' }}>
              Portfolio<span className="text-white">.</span>
            </a>

            <div className="hidden md:flex space-x-10 text-sm font-semibold">
              <a href="#" className="text-redTheme border-b-2 border-redTheme pb-1 transition-all">Home</a>
              <a href="#about" className="text-gray-300 hover:text-redTheme transition-colors">About</a>
              <a href="#services" className="text-gray-300 hover:text-redTheme transition-colors">Services</a>
              <a href="#portfolio" className="text-gray-300 hover:text-redTheme transition-colors">Portfolio</a>
              <a href="#contact" className="text-gray-300 hover:text-redTheme transition-colors">Contact</a>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-white hover:text-redTheme transition-colors focus:outline-none"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <i data-feather="menu" className="w-8 h-8"></i>
            </button>
          </nav>

          {/* Mobile Menu Overlay */}
          {mobileMenuOpen && (
            <div className="md:hidden flex flex-col items-center bg-[#111]/98 backdrop-blur-md absolute top-[88px] left-0 right-0 z-40 border-b border-gray-800 py-4 pb-6 transition-all shadow-[0_10px_30px_rgba(0,0,0,0.8)]">
              <a href="#" className="w-full text-center py-3 text-redTheme font-medium hover:bg-[#222]">Home</a>
              <a href="#about" className="w-full text-center py-3 text-gray-300 font-medium hover:text-redTheme hover:bg-[#222]">About</a>
              <a href="#services" className="w-full text-center py-3 text-gray-300 font-medium hover:text-redTheme hover:bg-[#222]">Services</a>
              <a href="#portfolio" className="w-full text-center py-3 text-gray-300 font-medium hover:text-redTheme hover:bg-[#222]">Portfolio</a>
              <a href="#contact" className="w-full text-center py-3 text-gray-300 font-medium hover:text-redTheme hover:bg-[#222]">Contact</a>
            </div>
          )}

          {/* Hero Section */}
          <div className="flex-1 flex flex-col-reverse md:flex-row items-center justify-center my-10 md:my-0 lg:mt-16 pb-12 gap-12 lg:gap-20">
            {/* Text Content */}
            <div className="w-full md:w-1/2 flex flex-col justify-center space-y-5 text-center md:text-left z-10 box-border">
              <h2 className="text-xl md:text-2xl lg:text-3xl font-medium text-white mb-2">
                Hello, <span className="text-redTheme">I am</span>
              </h2>

              <div className="h-10 md:h-12 lg:h-16 flex items-center justify-center md:justify-start">
                <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white m-0 leading-tight">
                  {heroText}
                </h1>
                <span className="cursor"></span>
              </div>

              <h3
                className="text-lg md:text-2xl lg:text-3xl font-bold text-redTheme mb-4"
                style={{ textShadow: '0 0 10px rgba(255,0,0,0.4)' }}
              >
                Full Stack Developer & Creative Designer
              </h3>

              <p className="text-gray-400 text-sm md:text-base lg:text-lg leading-relaxed max-w-lg mx-auto md:mx-0 mb-6 font-medium">
                I create exceptional digital experiences through innovative web development and stunning design solutions. Passionate about crafting user-centric applications that make a difference.
              </p>

              {/* Social Icons */}
              <div className="flex items-center justify-center md:justify-start space-x-5 mb-8">
                <a href="#" className="social-icon">
                  <i data-feather="facebook" className="w-5 h-5 fill-current"></i>
                </a>
                <a href="#" className="social-icon">
                  <i data-feather="twitter" className="w-5 h-5 fill-current"></i>
                </a>
                <a href="#" className="social-icon">
                  <i data-feather="instagram" className="w-5 h-5"></i>
                </a>
                <a href="#" className="social-icon">
                  <i data-feather="linkedin" className="w-5 h-5 fill-current"></i>
                </a>
              </div>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start space-y-4 sm:space-y-0 sm:space-x-6 mt-4">
                <button className="btn-primary w-full sm:w-auto px-10 py-3.5 rounded-sm font-bold tracking-wide uppercase text-sm">
                  Download CV
                </button>
                <a href="#contact" className="btn-secondary w-full sm:w-auto px-10 py-3.5 rounded-sm font-bold tracking-wide uppercase text-sm flex items-center justify-center">
                  Contact Me
                </a>
              </div>
            </div>

            {/* Image Content */}
            <div className="w-full md:w-1/2 flex justify-center items-center mt-8 md:mt-0 pb-10 md:pb-0 z-0">
              <div className="relative rounded-full glow-img-container p-1 max-w-[280px] max-h-[280px] w-full aspect-square sm:max-w-[350px] sm:max-h-[350px] lg:max-w-[450px] lg:max-h-[450px]">
                <img
                  src="/Pagente.png"
                  alt="Profile Vector"
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
            </div>
          </div>

          {/* About Section */}
          <section id="about" className="py-12 md:py-20 border-t border-gray-800 mt-10">
            <div className="max-w-4xl mx-auto text-center mb-12 md:mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                About <span className="text-redTheme">Me</span>
              </h2>
              <div className="w-20 h-1 bg-redTheme mx-auto mb-6 md:mb-8 shadow-[0_0_10px_#ff0000]"></div>
              <p className="text-base md:text-lg text-gray-400 leading-relaxed">
                I am a student at the University of Cebu, passionately pursuing knowledge in Information Technology. My journey is driven by a deep curiosity for web development and a commitment to solving real-world problems through technology. I thrive in collaborative environments where I can both contribute and learn from experienced professionals.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6 md:gap-8">
              {/* Education */}
              <div className="bg-[#111] p-6 md:p-8 rounded-lg border border-gray-800 hover:border-redTheme transition-all duration-300 hover:shadow-[0_0_15px_rgba(255,0,0,0.2)] group">
                <i data-feather="book" className="w-8 h-8 md:w-10 md:h-10 text-redTheme mb-5 md:mb-6 group-hover:drop-shadow-[0_0_8px_rgba(255,0,0,0.8)] transition-all"></i>
                <h3 className="text-lg md:text-xl font-semibold text-white mb-2 md:mb-3">Education</h3>
                <p className="text-sm md:text-base text-gray-400 leading-relaxed">
                  Currently pursuing my degree in Information Technology at University of Cebu, with a focus on web development and database systems.
                </p>
              </div>
              
              {/* Goals */}
              <div className="bg-[#111] p-6 md:p-8 rounded-lg border border-gray-800 hover:border-redTheme transition-all duration-300 hover:shadow-[0_0_15px_rgba(255,0,0,0.2)] group">
                <i data-feather="target" className="w-8 h-8 md:w-10 md:h-10 text-redTheme mb-5 md:mb-6 group-hover:drop-shadow-[0_0_8px_rgba(255,0,0,0.8)] transition-all"></i>
                <h3 className="text-lg md:text-xl font-semibold text-white mb-2 md:mb-3">Goals</h3>
                <p className="text-sm md:text-base text-gray-400 leading-relaxed">
                  To develop innovative web solutions that enhance user experience while continuously expanding my technical skillset and professional network.
                </p>
              </div>
              
              {/* Passions */}
              <div className="bg-[#111] p-6 md:p-8 rounded-lg border border-gray-800 hover:border-redTheme transition-all duration-300 hover:shadow-[0_0_15px_rgba(255,0,0,0.2)] group">
                <i data-feather="heart" className="w-8 h-8 md:w-10 md:h-10 text-redTheme mb-5 md:mb-6 group-hover:drop-shadow-[0_0_8px_rgba(255,0,0,0.8)] transition-all"></i>
                <h3 className="text-lg md:text-xl font-semibold text-white mb-2 md:mb-3">Passions</h3>
                <p className="text-sm md:text-base text-gray-400 leading-relaxed">
                  Clean code, intuitive UI/UX design, and the endless possibilities of web technologies to transform ideas into functional digital experiences.
                </p>
              </div>
            </div>
          </section>

          {/* Services (Skills) Section */}
          <section id="services" className="py-12 md:py-20 border-t border-gray-800">
            <div className="max-w-4xl mx-auto text-center mb-12 md:mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Technical <span className="text-redTheme">Skills</span>
              </h2>
              <div className="w-20 h-1 bg-redTheme mx-auto mb-6 md:mb-8 shadow-[0_0_10px_#ff0000]"></div>
              <p className="text-base md:text-lg text-gray-400">
                A collection of technologies I've worked with and continue to develop expertise in.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Skill Items */}
              {[
                { name: 'React', icon: 'code', percentage: '90%' },
                { name: 'Tailwind CSS', icon: 'layout', percentage: '85%' },
                { name: 'JavaScript', icon: 'cpu', percentage: '80%' },
                { name: 'MySQL', icon: 'database', percentage: '75%' },
                { name: 'PHP', icon: 'server', percentage: '70%' },
                { name: 'Git', icon: 'git-merge', percentage: '65%' },
                { name: 'Bash', icon: 'terminal', percentage: '60%' },
                { name: 'Figma', icon: 'figma', percentage: '55%' },
              ].map((skill, index) => (
                <div key={index} className="bg-[#111] p-6 rounded-lg border border-gray-800 hover:border-redTheme transition-all duration-300">
                  <i data-feather={skill.icon} className="w-8 h-8 text-redTheme mb-4 drop-shadow-[0_0_5px_rgba(255,0,0,0.5)]"></i>
                  <h3 className="font-medium text-white mb-3 text-lg">{skill.name}</h3>
                  <div className="w-full bg-gray-800 rounded-full h-1.5 mt-2 overflow-hidden">
                    <div className="bg-redTheme h-1.5 rounded-full shadow-[0_0_10px_#ff0000]" style={{ width: skill.percentage }}></div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Portfolio (Projects) Section */}
          <section id="portfolio" className="py-12 md:py-20 border-t border-gray-800">
            <div className="max-w-4xl mx-auto text-center mb-12 md:mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Featured <span className="text-redTheme">Projects</span>
              </h2>
              <div className="w-20 h-1 bg-redTheme mx-auto mb-6 md:mb-8 shadow-[0_0_10px_#ff0000]"></div>
              <p className="text-base md:text-lg text-gray-400">
                A selection of my recent work showcasing my technical abilities and problem-solving approach.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Project 1 */}
              <div className="bg-[#111] rounded-xl overflow-hidden border border-gray-800 hover:border-redTheme transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_10px_30px_rgba(255,0,0,0.15)] group flex flex-col h-full">
                <div className="h-56 relative border-b border-gray-800 group-hover:border-redTheme transition-colors overflow-hidden shrink-0">
                  <img src="/sitin.png" alt="Sit-In Management System" className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500" />
                </div>
                <div className="p-6 flex flex-col flex-1 justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-redTheme transition-colors">Sit-In Management System</h3>
                    <p className="text-gray-400 mb-6 text-sm leading-relaxed">A comprehensive system for managing student seating arrangements and classroom utilization.</p>
                  </div>
                  <div>
                    <div className="flex flex-wrap gap-2 mb-6">
                      <span className="px-3 py-1 bg-[#222] text-gray-300 text-xs rounded-full border border-gray-700">PHP</span>
                      <span className="px-3 py-1 bg-[#222] text-gray-300 text-xs rounded-full border border-gray-700">MySQL</span>
                      <span className="px-3 py-1 bg-[#222] text-gray-300 text-xs rounded-full border border-gray-700">Bootstrap</span>
                    </div>
                    <a href="#" className="inline-flex items-center text-redTheme font-medium hover:text-white transition-colors text-sm uppercase tracking-wider">
                      Learn more <i data-feather="chevron-right" className="w-4 h-4 ml-1"></i>
                    </a>
                  </div>
                </div>
              </div>
              
              {/* Project 2 */}
              <div className="bg-[#111] rounded-xl overflow-hidden border border-gray-800 hover:border-redTheme transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_10px_30px_rgba(255,0,0,0.15)] group flex flex-col h-full">
                <div className="h-56 relative border-b border-gray-800 group-hover:border-redTheme transition-colors overflow-hidden shrink-0">
                  <img src="/reservation.png" alt="Reservation System" className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500" />
                </div>
                <div className="p-6 flex flex-col flex-1 justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-redTheme transition-colors">Reservation System</h3>
                    <p className="text-gray-400 mb-6 text-sm leading-relaxed">An online platform for scheduling and managing facility reservations with real-time availability.</p>
                  </div>
                  <div>
                    <div className="flex flex-wrap gap-2 mb-6">
                      <span className="px-3 py-1 bg-[#222] text-gray-300 text-xs rounded-full border border-gray-700">JavaScript</span>
                      <span className="px-3 py-1 bg-[#222] text-gray-300 text-xs rounded-full border border-gray-700">Firebase</span>
                      <span className="px-3 py-1 bg-[#222] text-gray-300 text-xs rounded-full border border-gray-700">HTML5</span>
                    </div>
                    <a href="#" className="inline-flex items-center text-redTheme font-medium hover:text-white transition-colors text-sm uppercase tracking-wider">
                      Learn more <i data-feather="chevron-right" className="w-4 h-4 ml-1"></i>
                    </a>
                  </div>
                </div>
              </div>
              
              {/* Project 3 */}
              <div className="bg-[#111] rounded-xl overflow-hidden border border-gray-800 hover:border-redTheme transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_10px_30px_rgba(255,0,0,0.15)] group flex flex-col h-full">
                <div className="h-56 relative border-b border-gray-800 group-hover:border-redTheme transition-colors overflow-hidden shrink-0">
                  <img src="/reward.png" alt="Reward System" className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500" />
                </div>
                <div className="p-6 flex flex-col flex-1 justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-redTheme transition-colors">Reward System</h3>
                    <p className="text-gray-400 mb-6 text-sm leading-relaxed">An incentive program application that tracks and rewards user achievements and milestones.</p>
                  </div>
                  <div>
                    <div className="flex flex-wrap gap-2 mb-6">
                      <span className="px-3 py-1 bg-[#222] text-gray-300 text-xs rounded-full border border-gray-700">PHP</span>
                      <span className="px-3 py-1 bg-[#222] text-gray-300 text-xs rounded-full border border-gray-700">jQuery</span>
                      <span className="px-3 py-1 bg-[#222] text-gray-300 text-xs rounded-full border border-gray-700">CSS3</span>
                    </div>
                    <a href="#" className="inline-flex items-center text-redTheme font-medium hover:text-white transition-colors text-sm uppercase tracking-wider">
                      Learn more <i data-feather="chevron-right" className="w-4 h-4 ml-1"></i>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Contact Section */}
          <section id="contact" className="py-12 md:py-20 border-t border-gray-800">
            <div className="max-w-5xl mx-auto">
              <div className="bg-[#111] rounded-xl overflow-hidden shadow-2xl border border-gray-800">
                <div className="md:flex">
                  {/* Contact Info */}
                  <div className="md:w-5/12 bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] p-6 lg:p-10 text-white relative overflow-hidden md:border-r md:border-b-0 border-b border-gray-800">
                    <div className="absolute top-0 right-0 w-24 h-24 md:w-32 md:h-32 bg-redTheme opacity-10 rounded-bl-full blur-2xl"></div>
                    <div className="relative z-10">
                      <h2 className="text-2xl md:text-3xl font-bold mb-2">Get In <span className="text-redTheme">Touch</span></h2>
                      <div className="w-12 h-1 bg-redTheme mb-6 md:mb-8 shadow-[0_0_10px_#ff0000]"></div>
                      <p className="mb-8 md:mb-10 text-sm md:text-base text-gray-400 leading-relaxed">
                        Interested in collaborating or have questions about my work? Feel free to reach out—I'm always open to discussing new projects and opportunities.
                      </p>
                      
                      <div className="space-y-5 md:space-y-6">
                        <div className="flex items-start">
                          <div className="bg-[#222] p-2.5 md:p-3 rounded-full mr-4 text-redTheme">
                            <i data-feather="mail" className="w-4 h-4 md:w-5 md:h-5"></i>
                          </div>
                          <div>
                            <h4 className="font-semibold text-base md:text-lg">Email</h4>
                            <p className="text-sm md:text-base text-gray-400 break-all md:break-normal">Chrisninopagente2@gmail.com</p>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <div className="bg-[#222] p-2.5 md:p-3 rounded-full mr-4 text-redTheme">
                            <i data-feather="map-pin" className="w-4 h-4 md:w-5 md:h-5"></i>
                          </div>
                          <div>
                            <h4 className="font-semibold text-base md:text-lg">Location</h4>
                            <p className="text-sm md:text-base text-gray-400">University of Cebu, Philippines</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Contact Form */}
                  <div className="md:w-7/12 p-6 lg:p-10 bg-[#0d0d0d]">
                    <form className="space-y-5 md:space-y-6" onSubmit={handleFormSubmit}>
                      {/* FormSubmit spam protection: Honeypot field (hidden from users, filled by bots) */}
                      <input type="text" name="_honey" style={{ display: 'none' }} tabIndex="-1" autoComplete="off" />
                      
                      {/* You can change this to "true" or remove this line entirely to enable a required reCAPTCHA check */}
                      <input type="hidden" name="_captcha" value="false" />
                      <div className="grid md:grid-cols-2 gap-5 md:gap-6">
                        <div>
                          <label htmlFor="name" className="block text-sm font-medium text-gray-400 mb-2">Your Name</label>
                          <input type="text" id="name" name="name" required className="w-full bg-[#1a1a1a] text-white px-4 py-2.5 md:py-3 text-sm md:text-base border border-gray-800 rounded-lg focus:outline-none focus:border-redTheme focus:ring-1 focus:ring-redTheme transition-colors" placeholder="John Doe" />
                        </div>
                        <div>
                          <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-2">Your Email</label>
                          <input type="email" id="email" name="email" required className="w-full bg-[#1a1a1a] text-white px-4 py-2.5 md:py-3 text-sm md:text-base border border-gray-800 rounded-lg focus:outline-none focus:border-redTheme focus:ring-1 focus:ring-redTheme transition-colors" placeholder="john@example.com" />
                        </div>
                      </div>
                      <div>
                        <label htmlFor="subject" className="block text-sm font-medium text-gray-400 mb-2">Subject</label>
                        <input type="text" id="subject" name="_subject" className="w-full bg-[#1a1a1a] text-white px-4 py-2.5 md:py-3 text-sm md:text-base border border-gray-800 rounded-lg focus:outline-none focus:border-redTheme focus:ring-1 focus:ring-redTheme transition-colors" placeholder="Project Inquiry" />
                      </div>
                      <div>
                        <label htmlFor="message" className="block text-sm font-medium text-gray-400 mb-2">Message</label>
                        <textarea id="message" name="message" required rows="5" className="w-full bg-[#1a1a1a] text-white px-4 py-2.5 md:py-3 text-sm md:text-base border border-gray-800 rounded-lg focus:outline-none focus:border-redTheme focus:ring-1 focus:ring-redTheme transition-colors resize-none" placeholder="Hello, I'd like to talk about..."></textarea>
                      </div>
                      <button 
                        type="submit" 
                        disabled={formStatus === 'submitting'}
                        className={`w-full py-3.5 md:py-4 rounded-lg font-bold flex items-center justify-center tracking-wider transition-all text-sm md:text-base ${
                          formStatus === 'success' 
                            ? 'bg-green-600 text-white hover:bg-green-700 shadow-lg' 
                            : formStatus === 'error'
                            ? 'bg-red-600 text-white hover:bg-red-700 shadow-lg'
                            : 'btn-primary hover:shadow-[0_0_20px_rgba(255,0,0,0.4)]'
                        } ${formStatus === 'submitting' ? 'opacity-70 cursor-not-allowed' : ''}`}
                      >
                        {formStatus === 'submitting' ? (
                          <>
                            <i data-feather="loader" className="w-4 h-4 md:w-5 md:h-5 mr-2 animate-spin"></i> SENDING...
                          </>
                        ) : formStatus === 'success' ? (
                          <>
                            <i data-feather="check-circle" className="w-4 h-4 md:w-5 md:h-5 mr-2"></i> SENT SUCCESSFULLY!
                          </>
                        ) : formStatus === 'error' ? (
                          <>
                            <i data-feather="x-circle" className="w-4 h-4 md:w-5 md:h-5 mr-2"></i> ERROR. TRY AGAIN.
                          </>
                        ) : (
                          <>
                            <i data-feather="send" className="w-4 h-4 md:w-5 md:h-5 mr-2"></i> SEND MESSAGE
                          </>
                        )}
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Footer Component Inline */}
          <footer className="py-8 border-t border-gray-800 mt-10 text-center">
            <p className="text-gray-500 text-sm">
              &copy; {new Date().getFullYear()} Chris Niño G. Pagente. All Rights Reserved.
            </p>
          </footer>
        </div>
      )}
    </>
  );
}

export default App;
