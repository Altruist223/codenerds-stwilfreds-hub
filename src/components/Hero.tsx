import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import heroImage from "@/assets/hero-bg.jpg";
import { useEffect, useState } from "react";

// Sanitize code snippets to prevent XSS
const sanitizeCode = (code: string): string => {
  const div = document.createElement('div');
  div.textContent = code;
  return div.innerHTML;
};

const Hero = () => {
  const navigate = useNavigate();
  const [codeSnippets, setCodeSnippets] = useState<Array<{id: number, code: string, top: number, left: number, color: string, fontSize: string}>>([]);

  useEffect(() => {
    // Add new snippets more frequently for spamming effect
    const interval = setInterval(() => {
      setCodeSnippets(prev => {
        // Limit the number of snippets to prevent performance issues
        if (prev.length > 100) {
          prev = prev.slice(prev.length - 100);
        }
        
        // Add multiple new snippets at once for spamming effect
        const newSnippets = [];
        const snippetsToAdd = Math.floor(Math.random() * 5) + 3; // 3-7 snippets at a time
        
        for (let i = 0; i < snippetsToAdd; i++) {
          const newSnippet = {
            id: Date.now() + i, // Use timestamp as id
            code: sanitizeCode(getRandomCodeSnippet()),
            top: Math.random() * 100, // Random vertical position
            left: Math.random() * 100, // Random horizontal position
            color: Math.random() > 0.5 ? "text-accent" : "text-primary",
            fontSize: `${Math.random() * 0.4 + 0.4}rem` // Fixed font size per snippet
          };
          newSnippets.push(newSnippet);
        }
        
        return [...prev, ...newSnippets];
      });
    }, 200); // More frequent updates for spamming effect

    return () => clearInterval(interval);
  }, []);

  const getRandomCodeSnippet = () => {
    const snippets = [
      // JavaScript
      "console.log('Hello World!');",
      "const arr = [1, 2, 3].map(x => x * 2);",
      "async function fetchData() { return await fetch('/api'); }",
      "document.getElementById('app').innerHTML = 'Hello';",
      
      // Python
      "print('Hello, World!')",
      "def fibonacci(n): return n if n <= 1 else fibonacci(n-1) + fibonacci(n-2)",
      "import numpy as np",
      "for i in range(10): print(i)",
      
      // Java
      "public static void main(String[] args) { }",
      "System.out.println('Hello World');",
      "List<String> list = new ArrayList<>();",
      
      // C++
      "#include <iostream>",
      "std::cout << 'Hello World' << std::endl;",
      "for(int i = 0; i < 10; i++) { }",
      
      // C#
      "Console.WriteLine('Hello World');",
      "List<int> numbers = new List<int> {1, 2, 3};",
      
      // PHP
      "<?php echo 'Hello World'; ?>",
      "$arr = array_map(fn($x) => $x * 2, [1, 2, 3]);",
      
      // Ruby
      "puts 'Hello World'",
      "[1, 2, 3].map { |x| x * 2 }",
      
      // Swift
      "print('Hello, World!')",
      "let numbers = [1, 2, 3].map { $0 * 2 }",
      
      // Go
      "fmt.Println('Hello World')",
      "func fibonacci(n int) int { return n }",
      
      // Rust
      "println!(\"Hello, World!\");",
      "let numbers: Vec<i32> = vec![1, 2, 3];",
      
      // Kotlin
      "println('Hello World')",
      "val numbers = (1..10).map { it * 2 }",
      
      // TypeScript
      "const greet = (name: string): string => `Hello, ${name}`;",
      "interface User { name: string; age: number; }",
      
      // SQL
      "SELECT * FROM users WHERE active = 1;",
      "INSERT INTO products (name, price) VALUES ('item', 10.99);",
      
      // HTML
      "<div class='container'>Hello World</div>",
      "<button onclick='handleClick()'>Click Me</button>",
      
      // CSS
      ".container { display: flex; justify-content: center; }",
      "body { font-family: Arial, sans-serif; }",
      
      // Bash
      "echo 'Hello World'",
      "for file in *.txt; do echo $file; done",
      
      // R
      "print('Hello World')",
      "numbers <- c(1, 2, 3) * 2",
      
      // MATLAB
      "disp('Hello World')",
      "numbers = [1, 2, 3] * 2;",
      
      // Scala
      "println('Hello World')",
      "val numbers = List(1, 2, 3).map(_ * 2)",
      
      // Perl
      "print 'Hello World\\n';",
      "@numbers = map { $_ * 2 } (1, 2, 3);",
      
      // Lua
      "print('Hello World')",
      "numbers = {1, 2, 3}",
      
      // Dart
      "print('Hello World');",
      "List<int> numbers = [1, 2, 3].map((x) => x * 2).toList();"
    ];
    return snippets[Math.floor(Math.random() * snippets.length)];
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background/90 to-background/80" />
      
      {/* Animated Code Elements */}
      {codeSnippets.map((snippet) => (
        <div
          key={snippet.id}
          className={`absolute font-tech text-xs ${snippet.color} animate-spam`}
          style={{
            top: `${snippet.top}%`,
            left: `${snippet.left}%`,
            fontSize: snippet.fontSize,
            whiteSpace: 'nowrap'
          }}
        >
          {snippet.code}
        </div>
      ))}
      
      {/* Content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
        <div className="mb-6">
          <span className="inline-block px-4 py-2 bg-accent/10 border border-accent/20 rounded-full text-accent font-medium text-sm mb-6">
            St. Wilfred's P.G. College
          </span>
        </div>
        
        <h1 className="text-6xl md:text-8xl font-bold mb-6">
          <span className="gradient-text">Code</span>{" "}
          <span className="text-foreground">Nerds</span>
        </h1>
        
        <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
          Where passion meets programming. Join our community of tech enthusiasts,
          innovators, and future developers.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button
            size="lg"
            className="bg-gradient-primary hover:opacity-90 transition-opacity text-lg px-8 py-3"
            onClick={() => navigate('/join')}
          >
            Join the Club
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="border-accent text-accent hover:bg-accent hover:text-accent-foreground text-lg px-8 py-3"
            onClick={() => navigate('/events')}
          >
            View Events
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Hero;