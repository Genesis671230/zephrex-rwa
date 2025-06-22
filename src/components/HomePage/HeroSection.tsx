import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { 
  Wallet, 
  TrendingUp, 
  Globe, 
  Shield,
  ArrowRight,
  Sparkles,
  Bot,
  Zap,
  Network
} from 'lucide-react';
import spaceHero from '@/assets/space-hero.jpg';
import { Link } from 'react-router';
export default function HeroSection() {
  const connectedAddress = "0x1038775E596176cf2A945641b72F918cAf2ae661";

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  const floatingVariants = {
    animate: {
      y: [-10, 10, -10],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 py-20 overflow-hidden">
        <img src={spaceHero} alt="space hero" className='w-full h-full object-cover absolute top-0 left-0 z-10' />

      {/* Advanced Background Effects */}
      <div className="absolute inset-0 animated-gradient" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(20,184,166,0.15),transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(59,130,246,0.15),transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_80%,rgba(139,92,246,0.1),transparent_60%)]" />
      
      {/* Geometric Shapes */}
      <motion.div 
        className="absolute top-20 left-10 w-32 h-32 border border-teal-500/20 rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      />
      <motion.div 
        className="absolute bottom-20 right-10 w-24 h-24 border border-blue-500/20 rotate-45"
        animate={{ rotate: 405 }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
      />
      <motion.div 
        className="absolute top-1/2 left-20 w-16 h-16 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg"
        variants={floatingVariants as any}
        animate="animate"
      />
      
      <motion.div 
        className="relative z-10 max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center"
        variants={containerVariants as any}
        initial="hidden"
        animate="visible"
      >

        {/* Main Content */}
        <div className="text-center lg:text-left space-y-8">

          {/* AI Badge */}
          <motion.div 
            className="flex justify-center lg:justify-start"
            variants={itemVariants as any}
          >
            <Badge className="glass-strong text-teal-300 border-teal-500/30 px-6 py-3 text-sm font-medium">
              <Bot className="h-4 w-4 mr-2" />
              AI Agents Powered by AWS Bedrock
              <Sparkles className="h-4 w-4 ml-2" />
            </Badge>
          </motion.div>

          {/* Main Heading */}
          <motion.div className="space-y-6" variants={itemVariants as any}>
            <h1 className="text-4xl font-poppins md:text-5xl lg:text-6xl font-bold text-white leading-tight">
              Tokenize the World's{' '}
              <span className="gradient-text">
                Real Assets
              </span>{' '}
              
            </h1>
            <p className="text-lg md:text-xl text-slate-300 max-w-2xl leading-relaxed">
            Tokenize your business, Grow with AI Agents. Liquidity, Lending scalable and unstoppable.
            </p>
          </motion.div>

          {/* AI Features Grid */}
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
            variants={itemVariants as any}
          >
            {[
              { icon: Bot, label: "AI Marketing" },
              { icon: Network, label: "Operations" },
              { icon: Shield, label: "Monitoring" },
              { icon: Zap, label: "P2P Transfer" }
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="glass text-center p-4 rounded-xl hover:glass-strong transition-all duration-300"
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
              >
                <feature.icon className="h-6 w-6 text-teal-400 mx-auto mb-2" />
                <p className="text-xs text-slate-300 font-medium">{feature.label}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Connected Wallet */}
          <motion.div 
            className="flex items-center justify-center lg:justify-start gap-3 p-4 glass rounded-2xl max-w-md"
            variants={itemVariants as any}
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center gap-2 text-green-400">
              <motion.div 
                className="w-2 h-2 bg-green-400 rounded-full"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <Wallet className="h-5 w-5" />
            </div>
            <div className="text-left">
              <p className="text-xs text-slate-400">Connected to</p>
              <p className="text-sm font-mono text-white">{connectedAddress}</p>
            </div>
          </motion.div>

          {/* CTA Button */}
          <motion.div 
            className="flex justify-center lg:justify-start"
            variants={itemVariants as any}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link to="/marketplace">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 pulse-glow"
              >
                Launch App
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              </Link>

            </motion.div>
          </motion.div>

          {/* Stats */}
          <motion.div 
            className="grid grid-cols-3 gap-6 pt-8"
            variants={itemVariants as any}
          >
            {[
              { value: "$2.4B+", label: "Assets Tokenized" },
              { value: "150K+", label: "Global Investors" },
              { value: "12.8%", label: "Avg. Returns" }
            ].map((stat, index) => (
              <motion.div 
                key={index}
                className="text-center lg:text-left"
                whileHover={{ scale: 1.05 }}
              >
                <div className="text-2xl md:text-3xl font-bold text-white">{stat.value}</div>
                <div className="text-sm text-slate-400">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Property Card Preview */}
        <motion.div 
          className="flex justify-center lg:justify-end"
          variants={itemVariants as any}
        >
          <motion.div 
            className="glass-strong rounded-2xl p-6 max-w-sm w-full shadow-2xl"
            whileHover={{ scale: 1.02, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div 
              className="aspect-video bg-gradient-to-br from-teal-400 to-blue-600 rounded-xl mb-4 overflow-hidden"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <img 
                src="https://images.pexels.com/photos/1134176/pexels-photo-1134176.jpeg" 
                alt="Luxury Property" 
                className="w-full h-full object-cover"
              />
            </motion.div>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Badge className="bg-teal-500/20 text-teal-300 border-teal-500/30 text-xs">
                  ERC3643 Compliant
                </Badge>
              </div>
              <h3 className="text-white font-semibold text-lg">
                One Bedroom Apartment in Kensington Waters by Ellington
              </h3>
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-teal-400 font-bold">15.62% Projected ROI</div>
                  <div className="text-xs text-slate-400">Annual Returns</div>
                </div>
                <div>
                  <div className="text-blue-400 font-bold">8.06% Gross yield</div>
                  <div className="text-xs text-slate-400">Rental Yield</div>
                </div>
              </div>
              <motion.div 
                className="flex items-center gap-2 text-xs text-green-400"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <div className="w-2 h-2 bg-green-400 rounded-full" />
                <span>AI Agent Monitoring Active</span>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}