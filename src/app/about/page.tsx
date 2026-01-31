"use client";

import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Award, Users, Eye, Target, Cog, ShieldCheck, HeartHandshake, BrainCircuit, Sparkles, Zap, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";

const aboutHeroImage = PlaceHolderImages.find(img => img.id === 'about-hero');

// Hero slider images - using multiple placeholder images for the slider
const heroImages = [
  PlaceHolderImages.find(img => img.id === 'about-hero'),
  PlaceHolderImages.find(img => img.id === 'hero'),
  PlaceHolderImages.find(img => img.id === 'services-hero'),
].filter(Boolean);

const coreValues = [
    {
      icon: <Cog className="h-10 w-10" />,
      title: "Tailored Solutions - No One-Size-Fits-All",
      quote: "Your project, your requirements, your perfect solution.",
      description: "We reject cookie-cutter approaches in favor of personalized assessments and custom engineering. We provide flexible technology and financing options, with scalable designs that grow with your future needs.",
    },
    {
      icon: <BrainCircuit className="h-10 w-10" />,
      title: "Proven Expertise - Experience You Can Trust",
      quote: "We've encountered—and solved—virtually every challenge.",
      description: "Our team's collective experience spans residential, commercial, industrial, and infrastructure projects across challenging terrains. This diverse experience means we deliver reliable solutions every time.",
    },
    {
      icon: <ShieldCheck className="h-10 w-10" />,
      title: "Quality Assurance - Excellence Without Compromise",
      quote: "We build systems that last decades, not just years.",
      description: "Quality is non-negotiable. We use only Tier-1 internationally certified components, adhere to MNRE standards, and implement rigorous testing to ensure long-term reliability and performance.",
    },
    {
      icon: <HeartHandshake className="h-10 w-10" />,
      title: "Unmatched Support - Your Success is Our Success",
      quote: "We're not just vendors—we're your long-term energy partners.",
      description: "Our relationship evolves post-commissioning. We provide comprehensive training, 24/7 remote monitoring, annual maintenance, and rapid response to ensure your system operates at peak efficiency.",
    },
];

const stats = [
  { icon: <Award className="h-8 w-8" />, value: "500+", label: "Projects Completed" },
  { icon: <Users className="h-8 w-8" />, value: "10,000+", label: "Happy Customers" },
  { icon: <Zap className="h-8 w-8" />, value: "50MW+", label: "Solar Capacity" },
  { icon: <TrendingUp className="h-8 w-8" />, value: "98%", label: "Customer Satisfaction" },
];

export default function AboutPage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap');

        :root {
          --color-sunrise: #FF6B35;
          --color-amber: #FFB627;
          --color-honey: #FFA726;
          --color-cream: #FFF8E7;
          --color-warm-white: #FFFBF5;
          --color-deep-orange: #F4511E;
          --color-soft-peach: #FFE0B2;
        }

        .font-display {
          font-family: 'Playfair Display', serif;
        }

        .font-body {
          font-family: 'Plus Jakarta Sans', sans-serif;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        @keyframes shimmer {
          0% {
            background-position: -1000px 0;
          }
          100% {
            background-position: 1000px 0;
          }
        }

        @keyframes glow {
          0%, 100% {
            box-shadow: 0 0 20px rgba(255, 107, 53, 0.3);
          }
          50% {
            box-shadow: 0 0 40px rgba(255, 107, 53, 0.6);
          }
        }

        .animate-fadeInUp {
          animation: fadeInUp 0.8s ease-out forwards;
        }

        .animate-slideInRight {
          animation: slideInRight 0.8s ease-out forwards;
        }

        .animate-scaleIn {
          animation: scaleIn 0.6s ease-out forwards;
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-glow {
          animation: glow 2s ease-in-out infinite;
        }

        .hero-gradient {
          background: linear-gradient(135deg, 
            rgba(255, 107, 53, 0.95) 0%, 
            rgba(255, 166, 38, 0.9) 50%, 
            rgba(244, 81, 30, 0.85) 100%
          );
        }

        .text-gradient {
          background: linear-gradient(135deg, var(--color-sunrise), var(--color-amber));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .card-hover {
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .card-hover:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(255, 107, 53, 0.2);
        }

        .shimmer-effect {
          position: relative;
          overflow: hidden;
        }

        .shimmer-effect::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.3),
            transparent
          );
          animation: shimmer 3s infinite;
        }

        .glass-morphism {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .hero-slide {
          transition: opacity 1s ease-in-out;
        }
      `}</style>

      <div className="flex flex-col bg-gradient-to-b from-[var(--color-warm-white)] to-white font-body">
        {/* Enhanced Hero Section with Image Slider */}
        <section className="relative h-[70vh] min-h-[600px] w-full overflow-hidden">
          {/* Image Slider */}
          <div className="absolute inset-0">
            {heroImages.map((img, index) => (
              <div
                key={index}
                className={`absolute inset-0 hero-slide ${
                  index === currentSlide ? 'opacity-100' : 'opacity-0'
                }`}
              >
                {img && (
                  <Image
                    src={img.imageUrl}
                    alt={img.description}
                    data-ai-hint={img.imageHint}
                    fill
                    className="object-cover"
                    priority={index === 0}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Gradient Overlay */}
          <div className="absolute inset-0 hero-gradient" />

          {/* Floating Particles Effect */}
          <div className="absolute inset-0">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-white rounded-full opacity-30"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
                  animationDelay: `${Math.random() * 2}s`,
                }}
              />
            ))}
          </div>

          {/* Content */}
          <div className="relative z-10 flex h-full flex-col items-center justify-center text-center text-white p-4">
            <div
              className={`transition-all duration-1000 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
            >
              <div className="inline-block mb-6">
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md rounded-full px-6 py-2 border border-white/30">
                  <Sparkles className="h-5 w-5" />
                  <span className="text-sm font-semibold tracking-wide">DRIVING INDIA'S GREEN REVOLUTION</span>
                </div>
              </div>
              
              <h1 className="text-5xl font-display font-black md:text-7xl drop-shadow-2xl mb-6 leading-tight">
                About RaQuadrant<br />
                <span className="text-[var(--color-amber)]">Energy</span>
              </h1>
              
              <p className="mt-6 max-w-3xl text-xl md:text-2xl font-light leading-relaxed">
                Illuminating India's Future, One Solar Panel at a Time
              </p>

              {/* Slider Indicators */}
              <div className="flex gap-2 mt-12 justify-center">
                {heroImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      index === currentSlide
                        ? 'w-12 bg-white'
                        : 'w-2 bg-white/50 hover:bg-white/80'
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-8 animate-bounce">
              <div className="w-6 h-10 border-2 border-white rounded-full flex items-start justify-center p-2">
                <div className="w-1 h-3 bg-white rounded-full animate-pulse" />
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-gradient-to-r from-[var(--color-sunrise)] to-[var(--color-honey)] -mt-20 relative z-20">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="text-center text-white animate-fadeInUp"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex justify-center mb-4 animate-float" style={{ animationDelay: `${index * 0.3}s` }}>
                    {stat.icon}
                  </div>
                  <div className="text-4xl md:text-5xl font-display font-bold mb-2">{stat.value}</div>
                  <div className="text-sm md:text-base font-medium opacity-90">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Our Story */}
        <section className="py-20 lg:py-32 bg-white relative overflow-hidden">
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--color-soft-peach)] rounded-full blur-3xl opacity-20 -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-[var(--color-amber)] rounded-full blur-3xl opacity-10 translate-y-1/2 -translate-x-1/2" />
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-12 animate-fadeInUp">
                <div className="inline-block mb-4">
                  <span className="text-[var(--color-sunrise)] font-bold text-sm tracking-widest uppercase">Our Journey</span>
                </div>
                <h2 className="text-4xl font-display font-bold text-gray-900 md:text-6xl mb-6">
                  The Story <span className="text-gradient">Begins</span>
                </h2>
              </div>
              
              <div className="bg-gradient-to-br from-[var(--color-cream)] to-white rounded-3xl p-8 md:p-12 shadow-2xl animate-scaleIn border-2 border-[var(--color-soft-peach)]">
                <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
                  RaQuadrant Energy was born from a vision to make clean, affordable solar energy accessible to every home, business, and community. Founded by passionate engineers, we've grown into a trusted name in renewable energy across Eastern India. Operating extensively in <span className="font-bold text-[var(--color-sunrise)]">Uttar Pradesh, Bihar, Jharkhand, Odisha, West Bengal, and Assam</span>, our journey is defined by bold innovation, relentless execution, and a genuine focus on community impact. We are proud to be one of the fastest-growing solar EPC companies in the region, illuminating lives through sustainable energy.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Vision & Mission */}
        <section className="py-20 lg:py-32 bg-gradient-to-br from-[var(--color-sunrise)] via-[var(--color-honey)] to-[var(--color-deep-orange)] relative overflow-hidden">
          {/* Animated Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
              backgroundSize: '40px 40px'
            }} />
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl mx-auto">
              <div className="glass-morphism rounded-3xl p-8 md:p-12 text-white card-hover animate-fadeInUp">
                <div className="bg-white/20 rounded-full w-20 h-20 flex items-center justify-center mb-6 animate-glow">
                  <Eye className="h-12 w-12" />
                </div>
                <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">Our Vision</h2>
                <p className="text-lg leading-relaxed font-light">
                  "To redefine India's solar ecosystem with bold ideas, relentless execution, and solutions that inspire trust and transform lives."
                </p>
              </div>
              
              <div className="glass-morphism rounded-3xl p-8 md:p-12 text-white card-hover animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
                <div className="bg-white/20 rounded-full w-20 h-20 flex items-center justify-center mb-6 animate-glow" style={{ animationDelay: '1s' }}>
                  <Target className="h-12 w-12" />
                </div>
                <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">Our Mission</h2>
                <p className="text-lg leading-relaxed font-light">
                  "To deliver high-quality, reliable, and innovative solar solutions that customers can trust—executed with precision, transparency, and long-term commitment."
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Core Values Section */}
        <section className="py-20 lg:py-32 bg-gradient-to-b from-white to-[var(--color-warm-white)] relative overflow-hidden">
          {/* Decorative Elements */}
          <div className="absolute top-20 left-10 w-20 h-20 border-4 border-[var(--color-amber)] rounded-full opacity-20 animate-float" />
          <div className="absolute bottom-20 right-10 w-32 h-32 border-4 border-[var(--color-sunrise)] rounded-full opacity-20 animate-float" style={{ animationDelay: '1s' }} />
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-16 animate-fadeInUp">
              <div className="inline-block mb-4">
                <span className="text-[var(--color-sunrise)] font-bold text-sm tracking-widest uppercase">What Drives Us</span>
              </div>
              <h2 className="text-4xl font-display font-bold text-gray-900 md:text-6xl mb-4">
                Our Core <span className="text-gradient">Values</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">The RaQuadrant Pillars</p>
            </div>
            
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 max-w-7xl mx-auto">
              {coreValues.map((value, index) => (
                <Card 
                  key={value.title} 
                  className="bg-white border-0 shadow-xl hover:shadow-2xl rounded-2xl overflow-hidden card-hover animate-scaleIn group"
                  style={{ animationDelay: `${index * 0.15}s` }}
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[var(--color-sunrise)] to-[var(--color-amber)] opacity-5 rounded-bl-full transition-all duration-500 group-hover:opacity-20" />
                  
                  <CardHeader className="relative">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 bg-gradient-to-br from-[var(--color-sunrise)] to-[var(--color-honey)] text-white p-4 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                        {value.icon}
                      </div>
                      <CardTitle className="text-2xl font-display font-bold text-gray-900 leading-tight pt-2">
                        {value.title}
                      </CardTitle>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="flex flex-col">
                    <blockquote className="border-l-4 border-[var(--color-sunrise)] pl-6 my-6 text-lg font-semibold italic text-gray-700 shimmer-effect">
                      "{value.quote}"
                    </blockquote>
                    <p className="text-gray-600 leading-relaxed">{value.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-20 bg-gradient-to-r from-[var(--color-deep-orange)] via-[var(--color-sunrise)] to-[var(--color-honey)] relative overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0" style={{
              backgroundImage: `linear-gradient(45deg, transparent 48%, white 49%, white 51%, transparent 52%)`,
              backgroundSize: '20px 20px'
            }} />
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center text-white animate-fadeInUp">
              <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
                Ready to Go Solar?
              </h2>
              <p className="text-xl md:text-2xl mb-10 font-light">
                Join thousands of satisfied customers who've made the switch to clean energy
              </p>
              <button className="bg-white text-[var(--color-sunrise)] px-10 py-4 rounded-full text-lg font-bold hover:bg-opacity-90 transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:scale-105 animate-glow">
                Get Started Today
              </button>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}