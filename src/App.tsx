/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { 
  BrowserRouter as Router, 
  Routes, 
  Route, 
  Link, 
  useNavigate, 
  useParams,
  useLocation
} from "react-router-dom";
import { 
  Github, 
  Linkedin, 
  ExternalLink, 
  Network, 
  IterationCcw, 
  Database, 
  Activity,
  ArrowUpRight,
  ChevronLeft,
  Calendar,
  Clock,
  BookOpen
} from "lucide-react";

// --- Types ---
interface BlogPost {
  id: string;
  title: string;
  date: string;
  excerpt: string;
  readTime: string;
  slug: string;
}

// --- Blog Data ---
const BLOG_POSTS: BlogPost[] = [
  {
    id: "1",
    title: "Pragmatic AI: When to skip the LLM",
    date: "May 10, 2026",
    excerpt: "Why simpler deterministic approaches are often superior for production systems and how to identify the crossover point.",
    readTime: "6 min read",
    slug: "pragmatic-ai-skip-llm"
  },
  {
    id: "2",
    title: "Building Static Analysis Tools with Roslyn",
    date: "April 22, 2026",
    excerpt: "How to leverage Roslyn to build custom analyzers that catch distributed systems anti-patterns early in the dev cycle.",
    readTime: "12 min read",
    slug: "roslyn-static-analysis"
  },
  {
    id: "3",
    title: "Distributed Systems at Scale: Lessons Learned",
    date: "March 15, 2026",
    excerpt: "Core principles for building reliable, observable microservices that handle millions of requests without breaking the bank.",
    readTime: "15 min read",
    slug: "distributed-systems-scale"
  }
];

// --- Components ---
const Section = ({ title, id, children }: { title: string; id: string; children: React.ReactNode }) => (
  <motion.section 
    id={id}
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 0.6, ease: "easeOut" }}
    className="grid md:grid-cols-12 gap-8 mb-32"
  >
    <div className="md:col-span-3">
      <span className="section-label">{title}</span>
    </div>
    <div className="md:col-span-9">
      {children}
    </div>
  </motion.section>
);

const ProjectCard = ({ 
  title, 
  problem, 
  tried, 
  solution, 
  tradeoffs, 
  architecture, 
  outcome, 
  tags,
  isAI = true 
}: { 
  title: string; 
  problem: string; 
  tried: string; 
  solution: string; 
  tradeoffs: string[]; 
  architecture: string; 
  outcome: string; 
  tags: string[];
  isAI?: boolean;
}) => (
  <div className="project-card group mb-12 last:mb-0">
    <div className="flex justify-between items-start mb-6">
      <h2 className="text-2xl font-bold">{title} {!isAI && <span className="text-outline font-light text-lg ml-2">(No AI)</span>}</h2>
      <span className="tech-tag !bg-primary/10 !text-primary !border-primary/20 scale-110">Production</span>
    </div>
    
    <div className="space-y-4 text-sm leading-relaxed text-on-surface/90">
      <p><strong className="text-primary uppercase text-[10px] tracking-wider mr-2">Problem:</strong> {problem}</p>
      <p><strong className="text-primary uppercase text-[10px] tracking-wider mr-2">Tried:</strong> {tried}</p>
      <p><strong className="text-primary uppercase text-[10px] tracking-wider mr-2">Solution:</strong> {solution}</p>
      
      <div className="py-4 px-5 bg-surface-container/50 rounded-lg border border-outline-variant/20 my-6">
        <strong className="text-primary uppercase text-[10px] tracking-wider block mb-3">Trade-offs:</strong>
        <ul className="list-disc list-inside space-y-1 text-on-surface-variant">
          {tradeoffs.map((item, i) => <li key={i}>{item}</li>)}
        </ul>
      </div>
      
      <p><strong className="text-primary uppercase text-[10px] tracking-wider mr-2">Architecture:</strong> {architecture}</p>
      <p><strong className="text-primary font-bold uppercase text-[10px] tracking-wider mr-2">Outcome:</strong> {outcome}</p>
    </div>
    
    <div className="flex flex-wrap gap-2 mt-8">
      {tags.map(tag => <span key={tag} className="tech-tag">{tag}</span>)}
    </div>
  </div>
);

const BlogPostView = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [markdown, setMarkdown] = useState<string>("");
  const [loading, setLoading] = useState(true);

  const post = BLOG_POSTS.find(p => p.slug === slug);

  useEffect(() => {
    if (slug) {
      setLoading(true);
      const githubUser = "chaluvadis";
      const githubRepo = "chaluvadis.github.io";
      const url = `https://raw.githubusercontent.com/${githubUser}/${githubRepo}/main/posts/${slug}.md`;

      fetch(url)
        .then(res => res.text())
        .then(text => {
          if (text.includes("404") || text.trim().startsWith("<!DOCTYPE html>")) {
            setMarkdown("# Post Content Not Found\n\nI couldn't find the markdown file for this post in the expected location.\n\n**Expected Path:**\n`" + url + "`\n\n**Common Fixes:**\n1. Ensure the file exists in the `posts/` directory of your `chaluvadis.github.io` repository.\n2. Ensure the filename matches the slug (e.g., `" + slug + ".md`).\n3. Check if your main branch is named `main` or `master`.");
          } else {
            setMarkdown(text);
          }
          setLoading(false);
        })
        .catch(err => {
          setMarkdown("# Error Loading Post\n\nFailed to fetch content from GitHub.");
          setLoading(false);
        });
    }
  }, [slug]);

  if (!post) {
    return (
      <div className="max-w-4xl mx-auto pt-24 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-surface-high border border-outline-variant mb-8">
          <BookOpen className="w-8 h-8 text-outline" />
        </div>
        <h1 className="text-4xl font-bold mb-4">Post not found</h1>
        <p className="text-on-surface-variant mb-12 font-light">The piece you're looking for might have been moved or renamed.</p>
        <button 
          onClick={() => navigate("/blogs")} 
          className="text-primary font-bold uppercase tracking-widest text-xs border border-primary/20 px-8 py-4 rounded-full hover:bg-primary/5 transition-all"
        >
          Return to All Writings
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto pt-12">
      <div className="mb-16">
        <button 
          onClick={() => navigate("/blogs")}
          className="flex items-center gap-2 text-outline hover:text-primary transition-colors mb-12 group text-xs font-bold uppercase tracking-widest"
        >
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to list
        </button>

        <div className="space-y-6 mb-16">
          <div className="flex items-center gap-4 text-[10px] text-outline uppercase tracking-[0.2em] font-bold">
            <span className="text-primary/60">{post.date}</span>
            <span className="w-1 h-1 rounded-full bg-outline-variant"></span>
            <span>{post.readTime}</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tighter leading-[1.1]">
            {post.title}
          </h1>
        </div>
      </div>

      {loading ? (
        <div className="animate-pulse space-y-8">
          <div className="h-12 bg-surface-high rounded w-3/4"></div>
          <div className="h-4 bg-surface-high rounded w-1/4"></div>
          <div className="space-y-4">
            <div className="h-4 bg-surface-high rounded"></div>
            <div className="h-4 bg-surface-high rounded"></div>
            <div className="h-4 bg-surface-high rounded w-5/6"></div>
          </div>
        </div>
      ) : (
        <motion.article 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="prose prose-invert prose-primary max-w-none prose-headings:font-display prose-headings:tracking-tight prose-a:text-accent-blue"
        >
          <div className="markdown-body custom-markdown">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>
          </div>
        </motion.article>
      )}
    </div>
  );
};

const BlogList = () => {
  const navigate = useNavigate();

  return (
    <div className="pt-12 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-24">
        <div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-4">Writings</h1>
          <p className="text-on-surface-variant text-lg font-light max-w-xl">
            Technical deep dives into distributed systems, engineering culture, and selective AI integration.
          </p>
        </div>
        <Link 
          to="/"
          className="text-[10px] tracking-[0.2em] uppercase font-bold text-outline hover:text-primary transition-colors flex items-center gap-2"
        >
          <ChevronLeft className="w-3 h-3" /> Portfolio
        </Link>
      </div>

      <div className="grid gap-px bg-outline-variant/10 border border-outline-variant/10 rounded-2xl overflow-hidden">
        {BLOG_POSTS.map((post, index) => (
          <motion.div 
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => navigate(`/blogs/${post.slug}`)}
            className="group cursor-pointer bg-surface p-8 md:p-12 hover:bg-surface-high transition-all flex flex-col md:flex-row gap-8 items-start active:translate-y-0.5"
          >
            <div className="md:w-32 pt-1">
              <span className="text-[10px] font-mono text-outline uppercase tracking-widest block mb-2">{post.date}</span>
              <span className="flex items-center gap-1.5 text-[10px] text-primary/60 uppercase tracking-widest">
                <Clock className="w-3 h-3" /> {post.readTime}
              </span>
            </div>
            
            <div className="flex-1">
              <h2 className="text-2xl md:text-3xl font-bold mb-4 group-hover:text-primary transition-colors leading-tight">
                {post.title}
              </h2>
              <p className="text-on-surface-variant font-light leading-relaxed max-w-2xl mb-8 line-clamp-2">
                {post.excerpt}
              </p>
              
              <div className="flex items-center gap-4">
                <div className="h-px bg-outline-variant flex-1 group-hover:bg-primary/20 transition-colors"></div>
                <span className="text-accent-blue text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 whitespace-nowrap">
                  Read Analysis <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const PortfolioView = ({ scrollTo }: { scrollTo: (id: string) => void }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.3 }}
  >
    {/* Header Hero */}
    <header className="mb-32">
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl"
      >
        <h1 className="text-5xl md:text-8xl font-bold mb-8 leading-[1.1] tracking-tighter">
          Surendra Chaluvadi
        </h1>
        <p className="text-xl md:text-2xl text-on-surface-variant mb-12 leading-relaxed font-light">
          Senior Systems Engineer · 15 years building reliable distributed systems · Selective AI integration where it matters
        </p>
        <div className="pl-6 border-l-2 border-primary/20 italic text-lg text-on-surface/80 max-w-2xl font-light leading-relaxed">
          "Production systems fail predictably. Build instrumentation to see it coming. Add intelligence only where deterministic approaches fall short."
        </div>
      </motion.div>
    </header>

    {/* About */}
    <Section title="About" id="about">
      <div className="max-w-2xl space-y-6 text-lg leading-relaxed text-on-surface/90 font-light">
        <p>I've spent 15 years building systems that need to stay up, scale predictably, and cost less than the revenue they generate. Started in healthcare and finance, moved through aerospace and enterprise SaaS, now focused on cloud platforms and developer tooling.</p>
        <p>I integrate AI/ML when simpler approaches don't work—semantic search where regex fails, anomaly detection where thresholds break, clustering when manual categorization becomes unmaintainable. The rest of the time, I reach for Postgres, Redis, and well-tested algorithms.</p>
        <p>Current focus: building tools that make distributed systems visible (DI analyzers, config diff engines, schema sync) and integrating embeddings/transformers into search and categorization pipelines where they improve outcomes measurably.</p>
      </div>
    </Section>

    {/* Thinking Model */}
    <Section title="Thinking Model" id="thinking-model">
      <div className="grid sm:grid-cols-2 gap-x-12 gap-y-6">
        <ul className="space-y-4 text-on-surface/80 text-sm">
          {[
            "Prefers developer experience automation over manual processes",
            "Treats tooling as a first-class engineering investment",
            "Assumes configuration drift is inevitable; builds comparison layers",
            "Values visualization of invisible system relationships",
            "Explores serialization and format design as compression of intent"
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0"></span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
        <ul className="space-y-4 text-on-surface/80 text-sm">
          {[
            "Builds systems expecting failure; instruments before scaling",
            "Integrates AI where deterministic approaches fail measurably, not as default",
            "Measures twice before adding complexity (latency, cost, maintainability)",
            "Treats production constraints as design inputs, not deployment afterthoughts"
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0"></span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </Section>

    {/* Journey */}
    <Section title="Professional Journey" id="journey">
      <div className="relative pl-8 border-l border-outline-variant ml-4 space-y-16">
        {/* Current State */}
        <div className="relative">
          <div className="absolute -left-[41px] top-1.5 w-5 h-5 rounded-full bg-primary border-4 border-surface shadow-[0_0_15px_rgba(255,255,255,0.2)]"></div>
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-primary">Current State — Active Exploration</h3>
            <p className="text-on-surface-variant leading-relaxed text-sm">Exploring static analysis as runtime instrumentation alternative. Building tooling that surfaces invisible system relationships (dependency graphs, configuration drift, schema changes). Investigating serialization formats as compression of engineering intent.</p>
          </div>
        </div>

        {/* Senior Phase */}
        <div className="relative">
          <div className="absolute -left-[41px] top-1.5 w-5 h-5 rounded-full bg-surface-highest border-4 border-surface"></div>
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-2">
              <h3 className="text-xl font-bold text-primary">Senior Phase — Distributed Systems at Scale</h3>
              <span className="text-xs font-mono text-outline">2017–Present</span>
            </div>
            <p className="text-on-surface/90 text-sm">Built and operated cloud infrastructure supporting executive search platform. Deployed .NET microservices on AWS (EKS, Lambda, RDS, ElastiCache).</p>
            <p className="text-on-surface/80 text-xs">Starting in 2020, integrated machine learning selectively: semantic search with sentence transformers (tried BM25 + fuzzy matching first—accuracy wasn't good enough for domain queries), anomaly detection for data quality (percentile-based thresholds broke at scale, switched to isolation forests), document classification (manual categorization became bottleneck at 50k+ docs/month).</p>
            <div className="flex flex-wrap gap-2 pt-2">
              {["C#", "TypeScript", "Python", "AWS", "Kubernetes", "Terraform", "PostgreSQL", "Redis"].map(t => <span key={t} className="tech-tag">{t}</span>)}
            </div>
            <div className="text-[10px] uppercase tracking-widest text-outline">Spencer Stuart (Chicago)</div>
          </div>
        </div>

        {/* Previous Phases */}
        <div className="relative opacity-60">
          <div className="absolute -left-[41px] top-1.5 w-5 h-5 rounded-full bg-surface-highest border-4 border-surface"></div>
          <div className="space-y-2">
            <div className="flex justify-between items-baseline">
              <h3 className="text-lg font-bold text-primary">Mid-Career — Ownership Across Domains</h3>
              <span className="text-xs font-mono text-outline">2014–2017</span>
            </div>
            <p className="text-on-surface-variant text-sm">Led full-stack implementations in aerospace, automotive, and enterprise systems.</p>
            <div className="text-[10px] uppercase tracking-widest text-outline">TechnipFMC · Al Jaber Group · Tech Mahindra</div>
          </div>
        </div>
      </div>
    </Section>

    {/* Production Systems */}
    <Section title="Production Systems" id="systems">
      <ProjectCard 
        title="Semantic Search for Domain Terminology"
        problem="Executive search platform needed semantic search across profiles, job descriptions, and company data. Standard full-text search (Elasticsearch BM25) and fuzzy matching couldn't handle domain-specific terminology."
        tried="Elasticsearch with synonym dictionaries (became unmaintainable), fuzzy matching (too many false positives), BM25 tuning."
        solution="Integrated sentence-transformers (all-MiniLM-L6-v2) with vector similarity search. Embedded documents offline, stored vectors in Postgres with pgvector extension."
        tradeoffs={[
          "Added 40ms avg latency (acceptable for our use case)",
          "Cold start penalty on model loading (~2s, solved with provisioned concurrency)",
          "Storage cost: ~120MB vectors for 500k documents",
          "Model drift risk: retraining pipeline runs monthly on user feedback"
        ]}
        architecture="Python API (FastAPI) → Inference on AWS Lambda (1GB memory) → Postgres + pgvector → .NET API layer"
        outcome="Search relevance improved from 62% to 89% (measured via user clickthrough). Cost: $120/month inference + $40/month storage. Shipped in 6 weeks."
        tags={["Python", "FastAPI", "sentence-transformers", "AWS Lambda", "PostgreSQL", "pgvector", ".NET"]}
      />

      <ProjectCard 
        title="Anomaly Detection for Data Pipeline Quality"
        problem="Multi-tenant data ingestion pipeline processed ~2M records/day. Manual data quality checks became unmaintainable. Percentile-based thresholds broke when client data distributions changed."
        tried="Rule-based validation, statistical thresholds, manual review."
        solution="Built anomaly detection using isolation forests on feature distributions. Tracked 40+ metrics per client. Trained per-tenant models on 90 days historical data."
        tradeoffs={[
          "False positive rate: 3–5% (acceptable with human review queue)",
          "Training time: 20min nightly per tenant",
          "Required 90-day warm-up period for new clients",
          "Model explainability limited (isolation forest internals aren't obvious)"
        ]}
        architecture="Postgres → Python batch job (scikit-learn) → Feature extraction → Isolation forest training → Redis cache → Alert pipeline"
        outcome="Reduced data quality incidents from ~12/week to ~2/week. Caught 3 critical schema breaks before they hit production pipelines."
        tags={["Python", "scikit-learn", "PostgreSQL", "Redis", "AWS Batch", ".NET"]}
      />

      <ProjectCard 
        isAI={false}
        title="Multi-Tenant API Platform"
        problem="Built API platform serving 200+ clients with isolated data, varied SLAs, and different rate limits per tenant. Needed horizontal scaling, fault isolation, cost control."
        tried="N/A - Built from ground up for efficiency."
        solution="Distributed architecture with EKS, RDS Multi-AZ, and ElastiCache. Tenant isolation via Postgres schemas and per-tenant circuit breakers."
        tradeoffs={[
          "PgBouncer connection pooling complexity",
          "Probabilistic early expiration cache",
          "Spot instances for 40% cost savings",
          "Complex tracing requirements for observability"
        ]}
        architecture=".NET 6 API behind AWS ALB, RDS, ElastiCache, Kubernetes (EKS), Terraform"
        outcome="Served 50M requests/day at p99 latency of 145ms. Uptime: 99.95%. Cost: ~$8k/month (optimized from initial $14k)."
        tags={["C#", ".NET 6", "PostgreSQL", "Redis", "Kubernetes", "Terraform", "AWS EKS"]}
      />
    </Section>

    {/* Tooling */}
    <Section title="Developer Tooling" id="tooling">
      <p className="text-lg text-on-surface-variant mb-12 max-w-2xl font-light">
        Built VS Code extensions to improve daily workflows. These tools solve problems I hit repeatedly while building distributed systems.
      </p>
      <div className="grid sm:grid-cols-2 gap-6">
        {[
          { 
            icon: <Network className="w-6 h-6 text-primary" />, 
            title: "Can dependency injection be made visible?", 
            desc: "Static analysis with Roslyn reveals service lifetime conflicts and dependency chains before runtime.",
            tags: ["TypeScript", "Roslyn"],
            url: "#"
          },
          { 
            icon: <IterationCcw className="w-6 h-6 text-primary" />, 
            title: "Preventing K8s configuration drift?", 
            desc: "Side-by-side field-level diffs with visual highlighting make drift immediately obvious.",
            tags: ["TypeScript", "Helm"],
            url: "#"
          },
          { 
            icon: <Database className="w-6 h-6 text-primary" />, 
            title: "Serialization for human comprehension?", 
            desc: "Schema-first formats with visual compression reduce cognitive load during debugging.",
            tags: ["C#", ".NET 10"],
            url: "#"
          },
          { 
            icon: <Activity className="w-6 h-6 text-primary" />, 
            title: "Observability validation before deploy?", 
            desc: "Real-time diagnostics with LSP prevent broken observability pipelines in production.",
            tags: ["TypeScript", "LSP"],
            url: "#"
          }
        ].map((tool, i) => (
          <motion.div 
            key={i}
            whileHover={{ y: -5 }}
            className="p-8 bg-surface-container rounded-xl border border-outline-variant hover:bg-surface-high transition-all group relative cursor-pointer"
          >
            <div className="flex justify-between items-start mb-6">
              {tool.icon}
              <a href={tool.url} className="text-outline group-hover:text-primary transition-colors">
                <ArrowUpRight className="w-5 h-5" />
              </a>
            </div>
            <h4 className="text-md font-bold text-primary mb-3 leading-tight">{tool.title}</h4>
            <p className="text-xs text-on-surface-variant mb-6 leading-relaxed">{tool.desc}</p>
            <div className="flex gap-2">
              {tool.tags.map(t => <span key={t} className="tech-tag">{t}</span>)}
            </div>
          </motion.div>
        ))}
      </div>
    </Section>

    {/* Tech Map */}
    <Section title="Technology Map" id="tech-map">
      <div className="grid sm:grid-cols-2 gap-12">
        <div className="space-y-12">
          <div>
            <h4 className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] mb-6">Core Expertise</h4>
            <ul className="space-y-3 text-sm text-on-surface-variant font-light">
              {["Distributed systems architecture", ".NET platform architecture (C#)", "Cloud infrastructure (AWS EKS, Lambda)", "Database design (SQL Server, Postgres)", "Observability (Prometheus, Grafana)"].map(item => (
                <li key={item} className="flex items-center gap-2">
                  <div className="w-1 h-1 bg-accent-blue rounded-full"></div>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] mb-6">Applied AI/ML</h4>
            <ul className="space-y-3 text-sm text-on-surface-variant font-light">
              {["Embedding models (Sentence-transformers)", "Anomaly detection (Isolation forests)", "Vector databases (pgvector)", "ML infrastructure (Batch, Lambda)"].map(item => (
                <li key={item} className="flex items-center gap-2">
                  <div className="w-1 h-1 bg-accent-blue rounded-full"></div>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="space-y-12">
          <div>
            <h4 className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] mb-6">Actively Exploring</h4>
            <ul className="space-y-3 text-sm text-on-surface-variant font-light">
              {["VS Code extension ecosystem", "Static analysis (Roslyn, LSP)", "Infrastructure as Code (Terraform)", "Observability system design"].map(item => (
                <li key={item} className="flex items-center gap-2">
                  <div className="w-1 h-1 bg-white/20 rounded-full"></div>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] mb-6">Curious About</h4>
            <ul className="space-y-3 text-sm text-on-surface-variant font-light">
              {["DSL design", "Config management at scale", "Serialization format evolution"].map(item => (
                <li key={item} className="flex items-center gap-2">
                  <div className="w-1 h-1 bg-white/20 rounded-full"></div>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </Section>

    {/* Current Focus */}
    <Section title="Current Focus" id="focus">
      <div className="max-w-2xl space-y-12">
        <div>
          <p className="text-xl text-on-surface/90 leading-relaxed font-light">
            <strong className="text-primary font-bold block mb-4 text-2xl font-display">Right now (Q2 2025):</strong> 
            Building a VS Code extension for real-time Kubernetes config validation. Integrating pgvector-based semantic search into internal knowledge base. Exploring Roslyn analyzers for detecting async/await anti-patterns in .NET codebases.
          </p>
        </div>
        <div className="p-8 bg-error/5 border border-error/20 rounded-xl">
          <strong className="text-error uppercase text-[10px] tracking-[0.2em] block mb-4">Actively Avoiding</strong>
          <p className="text-on-surface-variant text-sm leading-relaxed font-light">
            Using LLMs where regex works fine. Overengineering single-tenant systems. Adding Kubernetes to projects that run fine on a single EC2 instance. Chasing AI hype without measuring business impact.
          </p>
        </div>
      </div>
    </Section>
  </motion.div>
);

const AppContent = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const scrollTo = (id: string) => {
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 100);
      return;
    }
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen selection:bg-primary/20 selection:text-primary">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-surface/80 backdrop-blur-md border-b border-outline-variant">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link 
              to="/"
              className="text-primary font-display font-bold text-lg tracking-tight hover:opacity-80 transition-opacity"
            >
              Surendra Chaluvadi
            </Link>
            <span className="hidden md:block w-px h-4 bg-outline-variant"></span>
            <span className="hidden md:block text-[10px] text-on-surface-variant font-medium uppercase tracking-widest">Senior Systems Engineer</span>
          </div>
          <div className="flex items-center gap-8">
            {["About", "Journey", "Systems", "Tooling", "Tech Map"].map((item) => (
              <button 
                key={item} 
                onClick={() => scrollTo(item.toLowerCase().replace(" ", "-"))}
                className="nav-link cursor-pointer"
              >
                {item}
              </button>
            ))}
            <Link 
              to="/blogs"
              className={`nav-link ${location.pathname.startsWith("/blogs") ? "text-primary" : ""}`}
            >
              Blog
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 pt-24 pb-32">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<PortfolioView scrollTo={scrollTo} />} />
            <Route path="/blogs" element={<BlogList />} />
            <Route path="/blogs/:slug" element={<BlogPostView />} />
          </Routes>
        </AnimatePresence>

        {/* Footer */}
        <footer className="pt-24 border-t border-outline-variant flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-outline text-[10px] tracking-[0.2em] uppercase font-medium">Surendra Chaluvadi © 2025</div>
          <div className="flex gap-12">
            <a 
              href="https://github.com/chaluvadis" 
              className="flex items-center gap-2 text-xs text-on-surface-variant hover:text-primary transition-colors tracking-widest uppercase font-bold"
            >
              <Github className="w-4 h-4" />
              GitHub
            </a>
            <a 
              href="https://linkedin.com/in/surendra-chaluvadi" 
              className="flex items-center gap-2 text-xs text-on-surface-variant hover:text-primary transition-colors tracking-widest uppercase font-bold"
            >
              <Linkedin className="w-4 h-4" />
              LinkedIn
            </a>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
