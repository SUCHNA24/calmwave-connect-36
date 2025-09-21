import { useState } from 'react';
import { Smile } from 'lucide-react';

interface EmojiPickerProps {
  onEmojiSelect: (emoji: string) => void;
}

const EMOJI_CATEGORIES = {
  emotions: ['😊', '😢', '😡', '😰', '🥺', '😌', '😔', '😟', '😞', '😕', '🙂', '😐', '😤', '😮‍💨', '🤗'],
  hearts: ['❤️', '💙', '💚', '💛', '🧡', '💜', '🤍', '🖤', '💕', '💖', '💗', '💓', '💝'],
  hands: ['👍', '👎', '👏', '🙏', '🤝', '👋', '✋', '🤚', '🖐️', '✌️', '🤞', '🤟', '🤘'],
  misc: ['✨', '💫', '⭐', '🌟', '🔥', '💯', '👑', '🎉', '🎊', '🌸', '🌺', '🌻', '🌷']
};

export default function EmojiPicker({ onEmojiSelect }: EmojiPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<keyof typeof EMOJI_CATEGORIES>('emotions');

  const handleEmojiClick = (emoji: string) => {
    onEmojiSelect(emoji);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-muted-foreground hover:text-primary transition-colors rounded-xl hover:bg-accent/50"
        type="button"
      >
        <Smile className="w-5 h-5" />
      </button>

      {isOpen && (
        <div className="absolute bottom-full right-0 mb-2 glass-card p-4 w-80 max-h-64 overflow-hidden">
          {/* Category Tabs */}
          <div className="flex justify-center space-x-2 mb-3 border-b border-glass-border pb-2">
            {Object.keys(EMOJI_CATEGORIES).map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category as keyof typeof EMOJI_CATEGORIES)}
                className={`px-3 py-1 text-xs rounded-lg transition-colors ${
                  activeCategory === category
                    ? 'bg-gradient-accent text-white'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>

          {/* Emoji Grid */}
          <div className="grid grid-cols-8 gap-1 overflow-y-auto max-h-32">
            {EMOJI_CATEGORIES[activeCategory].map((emoji, index) => (
              <button
                key={index}
                onClick={() => handleEmojiClick(emoji)}
                className="p-2 text-xl hover:bg-accent/50 rounded-lg transition-colors hover:scale-110 transform"
              >
                {emoji}
              </button>
            ))}
          </div>

          {/* Quick Access - Most Used */}
          <div className="mt-3 pt-2 border-t border-glass-border">
            <p className="text-xs text-muted-foreground mb-2">Quick Access</p>
            <div className="flex justify-center space-x-1">
              {['😊', '❤️', '👍', '🙏', '✨'].map((emoji, index) => (
                <button
                  key={index}
                  onClick={() => handleEmojiClick(emoji)}
                  className="p-1 text-lg hover:bg-accent/50 rounded-lg transition-colors hover:scale-110 transform"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Overlay to close picker when clicking outside */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[-1]"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}