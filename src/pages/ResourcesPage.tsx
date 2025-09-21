import { useState } from 'react';
import { BookOpen, Heart, Users, Brain, Search, ExternalLink, Download } from 'lucide-react';
import Navbar from '../components/Navbar';
import ParticleCursor from '../components/ParticleCursor';
import AnimateIn from '../components/AnimateIn';

interface Resource {
  id: string;
  title: string;
  description: string;
  category: 'article' | 'guide' | 'video' | 'exercise';
  readTime: string;
  tags: string[];
  link: string;
}

const ResourcesPage = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const resources: Resource[] = [
    {
      id: '1',
      title: 'Understanding Mental Health Stigma in Indian Society',
      description: 'Learn about the cultural factors that contribute to mental health stigma and how to overcome them.',
      category: 'article',
      readTime: '5 min read',
      tags: ['stigma', 'culture', 'awareness'],
      link: '#'
    },
    {
      id: '2',
      title: 'Breathing Exercises for Anxiety Relief',
      description: 'Simple breathing techniques that you can practice anywhere to manage anxiety and stress.',
      category: 'exercise',
      readTime: '10 min practice',
      tags: ['anxiety', 'breathing', 'mindfulness'],
      link: '#'
    },
    {
      id: '3',
      title: 'How to Talk to Your Parents About Mental Health',
      description: 'A practical guide to initiating conversations about mental health with Indian parents.',
      category: 'guide',
      readTime: '8 min read',
      tags: ['family', 'communication', 'parents'],
      link: '#'
    },
    {
      id: '4',
      title: 'Managing Academic Pressure: A Student\'s Guide',
      description: 'Strategies to cope with academic stress and maintain mental wellness during studies.',
      category: 'guide',
      readTime: '12 min read',
      tags: ['academic', 'stress', 'students'],
      link: '#'
    },
    {
      id: '5',
      title: 'Mindfulness Meditation for Beginners',
      description: 'Introduction to mindfulness practices specifically adapted for Indian youth.',
      category: 'video',
      readTime: '15 min watch',
      tags: ['mindfulness', 'meditation', 'beginners'],
      link: '#'
    },
    {
      id: '6',
      title: 'Building Self-Esteem and Confidence',
      description: 'Practical exercises to improve self-worth and build confidence in social situations.',
      category: 'exercise',
      readTime: '20 min practice',
      tags: ['self-esteem', 'confidence', 'social'],
      link: '#'
    }
  ];

  const categories = [
    { value: 'all', label: 'All Resources', icon: BookOpen },
    { value: 'article', label: 'Articles', icon: BookOpen },
    { value: 'guide', label: 'Guides', icon: Heart },
    { value: 'video', label: 'Videos', icon: Users },
    { value: 'exercise', label: 'Exercises', icon: Brain }
  ];

  const filteredResources = resources.filter(resource => {
    const matchesCategory = selectedCategory === 'all' || resource.category === selectedCategory;
    const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resource.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const getCategoryIcon = (category: Resource['category']) => {
    switch (category) {
      case 'article': return BookOpen;
      case 'guide': return Heart;
      case 'video': return Users;
      case 'exercise': return Brain;
      default: return BookOpen;
    }
  };

  const getCategoryColor = (category: Resource['category']) => {
    switch (category) {
      case 'article': return 'text-blue-500 bg-blue-500/10';
      case 'guide': return 'text-green-500 bg-green-500/10';
      case 'video': return 'text-purple-500 bg-purple-500/10';
      case 'exercise': return 'text-orange-500 bg-orange-500/10';
      default: return 'text-primary bg-primary/10';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <ParticleCursor />
      <Navbar />
      
      <main className="pt-20">
        <div className="container mx-auto px-4 py-8">
          <AnimateIn>
            <div className="text-center mb-8">
              <h1 className="text-4xl font-heading font-bold text-foreground mb-4">
                Mental Health Resources
              </h1>
              <p className="text-xl text-muted-foreground font-body max-w-2xl mx-auto">
                Curated articles, guides, and exercises to support your mental wellness journey.
                All content is culturally sensitive and specifically designed for Indian youth.
              </p>
            </div>
          </AnimateIn>

          <div className="max-w-6xl mx-auto">
            {/* Search and Filter */}
            <AnimateIn delay={0.2}>
              <div className="glass-card p-6 mb-8">
                <div className="flex flex-col lg:flex-row gap-4 items-center">
                  <div className="relative flex-1">
                    <Search className="w-5 h-5 text-muted-foreground absolute left-3 top-1/2 transform -translate-y-1/2" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search resources, topics, or tags..."
                      className="w-full pl-10 pr-4 py-2 bg-input border border-glass-border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-gradient-end focus:border-transparent focus:shadow-md font-body transition-all duration-300 hover:shadow-sm"
                    />
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {categories.map((category) => (
                      <button
                        key={category.value}
                        onClick={() => setSelectedCategory(category.value)}
                        className={`px-4 py-2 rounded-xl transition-all flex items-center space-x-2 ${
                          selectedCategory === category.value
                            ? 'bg-primary text-white'
                            : 'bg-glass-card border border-glass-border text-muted-foreground hover:border-primary'
                        }`}
                      >
                        <category.icon className="w-4 h-4" />
                        <span className="font-body">{category.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </AnimateIn>

            {/* Resources Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredResources.map((resource, index) => {
                const IconComponent = getCategoryIcon(resource.category);
                return (
                  <AnimateIn key={resource.id} delay={0.1 * index}>
                    <div className="glass-card p-6 h-full hover:scale-105 transition-all duration-300 group">
                      <div className="flex items-start justify-between mb-4">
                        <div className={`p-2 rounded-xl ${getCategoryColor(resource.category)}`}>
                          <IconComponent className="w-5 h-5" />
                        </div>
                        <span className="text-sm text-muted-foreground font-body">
                          {resource.readTime}
                        </span>
                      </div>
                      
                      <h3 className="text-lg font-heading font-semibold text-foreground mb-3 group-hover:text-primary transition-colors">
                        {resource.title}
                      </h3>
                      
                      <p className="text-muted-foreground font-body mb-4 text-sm leading-relaxed">
                        {resource.description}
                      </p>
                      
                      <div className="flex flex-wrap gap-1 mb-4">
                        {resource.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-1 bg-primary/10 text-primary text-xs font-body rounded-lg"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      
                      <div className="flex items-center justify-between mt-auto">
                        <span className={`text-xs font-body px-2 py-1 rounded-lg ${getCategoryColor(resource.category)}`}>
                          {resource.category}
                        </span>
                        <button 
                          onClick={() => window.open(resource.link, '_blank')}
                          className="flex items-center space-x-1 text-primary hover:text-primary/80 transition-colors"
                        >
                          <span className="text-sm font-body">Read more</span>
                          <ExternalLink className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </AnimateIn>
                );
              })}
            </div>

            {filteredResources.length === 0 && (
              <AnimateIn>
                <div className="text-center py-12">
                  <Search className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-heading font-semibold text-foreground mb-2">
                    No resources found
                  </h3>
                  <p className="text-muted-foreground font-body">
                    Try adjusting your search terms or category filters.
                  </p>
                </div>
              </AnimateIn>
            )}

            {/* Help Section */}
            <AnimateIn delay={0.4}>
              <div className="mt-16 glass-card p-8 text-center">
                <Download className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-2xl font-heading font-semibold text-foreground mb-4">
                  Need offline access?
                </h3>
                <p className="text-muted-foreground font-body mb-6 max-w-2xl mx-auto">
                  Download our mental health toolkit for offline reading. Perfect for when you need 
                  resources but don't have internet access.
                </p>
                <button 
                  onClick={() => {
                    // Create a simple download simulation
                    const link = document.createElement('a');
                    link.href = '#';
                    link.download = 'mental-health-toolkit.pdf';
                    link.click();
                  }}
                  className="btn-primary"
                >
                  Download Toolkit
                </button>
              </div>
            </AnimateIn>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ResourcesPage;