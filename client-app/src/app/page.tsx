
'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useTranslation, Trans } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  Package2,
  Rocket,
  ShieldCheck,
  Bot,
  Network,
  BarChart,
  Users,
  CheckCircle,
  ChevronRight,
  MessageCircle,
  Twitter,
  Github,
  Linkedin,
  Scale,
  BrainCircuit,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { GetStartedButton } from '@/components/get-started-button';
import { LanguageSwitcher } from '@/components/language-switcher';
import { ThemeToggle } from '@/components/theme-toggle';
import { motion } from 'framer-motion';

// Helper Components
const Logo = () => (
  <Link href="/" className="flex items-center gap-2 font-bold text-lg">
    <Package2 className="h-6 w-6 text-primary" />
    <span>LCUZR CRM</span>
  </Link>
);

const Header = () => {
    const { t } = useTranslation();
    const router = useRouter();

    const handleLogin = () => {
        router.push('/login');
    };

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 items-center">
                <div className="me-4 hidden md:flex">
                    <Logo />
                </div>
                <nav className="hidden items-center gap-6 text-sm md:flex">
                    <Link href="#features" className="text-muted-foreground transition-colors hover:text-foreground">Features</Link>
                    <Link href="#pricing" className="text-muted-foreground transition-colors hover:text-foreground">Pricing</Link>
                    <Link href="#testimonials" className="text-muted-foreground transition-colors hover:text-foreground">Testimonials</Link>
                    <Link href="#faq" className="text-muted-foreground transition-colors hover:text-foreground">FAQ</Link>
                </nav>
                <div className="flex flex-1 items-center justify-end gap-2">
                    <LanguageSwitcher />
                    <ThemeToggle />
                    <Button variant="ghost" onClick={handleLogin}>Log in</Button>
                    <GetStartedButton size="default">{t('landing.getStarted')}</GetStartedButton>
                </div>
            </div>
        </header>
    );
}

const Hero = () => {
    const { t } = useTranslation();
    const router = useRouter();

    return (
        <section className="relative w-full py-20 md:py-32 bg-gradient-to-br from-violet-100 via-white to-green-100 dark:from-violet-950/50 dark:via-background dark:to-green-950/50">
             <div className="container mx-auto text-center">
                <motion.h1 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-4xl md:text-6xl font-extrabold tracking-tight text-foreground"
                >
                    {t('landing.title')}
                </motion.h1>
                <motion.p 
                     initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground"
                >
                    {t('landing.description')}
                </motion.p>
                <motion.div 
                     initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="mt-8 flex justify-center gap-4"
                >
                    <GetStartedButton size="lg">{t('landing.getStarted')}</GetStartedButton>
                    <Button size="lg" variant="outline" onClick={() => router.push('/login')}>{t('landing.bookDemo')}</Button>
                </motion.div>
                <motion.div 
                     initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="mt-16 text-center"
                >
                    <p className="text-sm text-muted-foreground mb-4">{t('landing.trustedBy')}</p>
                    <div className="flex justify-center items-center gap-8 opacity-60">
                        <span className="font-semibold">TechCorp</span>
                        <span className="font-semibold">Innovate Inc.</span>
                        <span className="font-semibold">Solutions Ltd.</span>
                        <span className="font-semibold">Growth Co.</span>
                         <span className="font-semibold">NextGen</span>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}

const features = [
    { icon: Network, title: "Smart Team Structure", description: "Visually manage your entire organization's hierarchy with ease." },
    { icon: Bot, title: "AI-Powered Lead Scoring", description: "Automatically prioritize your leads based on their conversion probability." },
    { icon: ShieldCheck, title: "Granular Permission Control", "description": "Assign roles and control access to ensure data security and privacy." },
    { icon: Users, title: "Real-Time Collaboration", description: "Chat, assign tasks, and share files without ever leaving the CRM." },
    { icon: BarChart, title: "Advanced Analytics", description: "Gain deep insights into your sales pipeline and team performance." },
    { icon: Rocket, title: "Built for Scale", description: "Our infrastructure is designed to handle thousands of leads and users effortlessly." },
]
const FeaturesSection = () => {
    const { t } = useTranslation();
    return (
        <section id="features" className="py-20 md:py-28">
            <div className="container mx-auto">
                <div className="text-center max-w-3xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-bold">{t('landing.featuresTitle')}</h2>
                    <p className="mt-4 text-lg text-muted-foreground">{t('landing.featuresDescription')}</p>
                </div>
                <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.5 }}
                            transition={{ duration: 0.5, delay: i * 0.1 }}
                        >
                            <Card className="bg-card hover:shadow-lg transition-shadow h-full">
                                <CardHeader className="flex flex-row items-center gap-4">
                                    <div className="bg-primary/10 text-primary p-3 rounded-lg"><feature.icon className="h-6 w-6" /></div>
                                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground">{feature.description}</p>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};


const DashboardPreview = () => {
    const { t } = useTranslation();
    return (
        <section className="py-16 bg-muted/50">
            <div className="container mx-auto text-center">
                <h2 className="text-3xl md:text-4xl font-bold">{t('landing.dashboardTitle')}</h2>
                <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">{t('landing.dashboardDescription')}</p>
                <motion.div
                    initial={{ opacity: 0, y: 50, scale: 0.95 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.7 }}
                    className="mt-8 px-4"
                >
                    <Image 
                        src="https://placehold.co/1200x800.png"
                        alt="LCUZR CRM Dashboard Preview"
                        width={1200}
                        height={800}
                        className="rounded-xl shadow-2xl border"
                        data-ai-hint="dashboard user interface"
                    />
                </motion.div>
            </div>
        </section>
    );
}


const whyChooseUsItems = [
    { icon: CheckCircle, title: "Fast Onboarding", description: "Get your team up and running in minutes, not weeks." },
    { icon: Scale, title: "Built for Scale", description: "From startups to enterprise, our CRM grows with you." },
    { icon: BrainCircuit, title: "Integrated AI", description: "Leverage artificial intelligence for smarter selling and insights." },
    { icon: ShieldCheck, title: "Secure & Compliant", description: "Enterprise-grade security to protect your valuable data." },
];
const WhyChooseUs = () => {
    const { t } = useTranslation();
    const router = useRouter();
    return (
        <section id="why-us" className="py-20 md:py-28">
            <div className="container mx-auto grid md:grid-cols-2 gap-12 items-center">
                <div className="space-y-4">
                    <h2 className="text-3xl md:text-4xl font-bold">{t('landing.whyUsTitle')}</h2>
                    <p className="text-lg text-muted-foreground">{t('landing.whyUsDescription')}</p>
                    <Button size="lg" className="mt-4" onClick={() => router.push('/login')}>{t('landing.learnMore')} <ChevronRight className="ms-2 h-4 w-4 rtl:-scale-x-100"/></Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {whyChooseUsItems.map(item => (
                        <div key={item.title}>
                            <item.icon className="h-8 w-8 text-primary mb-2" />
                            <h3 className="font-semibold text-lg">{item.title}</h3>
                            <p className="text-muted-foreground mt-1">{item.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

const UseCases = () => {
    const { t } = useTranslation();
    return (
        <section id="use-cases" className="py-16 bg-muted/50">
            <div className="container mx-auto">
                <div className="text-center max-w-3xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-bold">{t('landing.useCasesTitle')}</h2>
                    <p className="mt-4 text-lg text-muted-foreground">{t('landing.useCasesDescription')}</p>
                </div>
                <Tabs defaultValue="agencies" className="mt-8 w-full max-w-4xl mx-auto">
                    <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
                        <TabsTrigger value="agencies">Agencies</TabsTrigger>
                        <TabsTrigger value="startups">Tech Startups</TabsTrigger>
                        <TabsTrigger value="enterprise">Enterprise</TabsTrigger>
                        <TabsTrigger value="freelancers">Freelancers</TabsTrigger>
                    </TabsList>
                    <TabsContent value="agencies" className="mt-6 p-6 bg-background rounded-lg border">
                        <h3 className="font-semibold text-xl">Manage Multiple Clients Seamlessly</h3>
                        <p className="text-muted-foreground mt-2">Keep client data, projects, and communication streams separate and organized. Assign dedicated teams to each client and track performance effortlessly.</p>
                    </TabsContent>
                    <TabsContent value="startups" className="mt-6 p-6 bg-background rounded-lg border">
                        <h3 className="font-semibold text-xl">Scale Your Sales Engine</h3>
                        <p className="text-muted-foreground mt-2">From your first lead to your thousandth customer, LCUZR provides the tools you need to build a repeatable and scalable sales process.</p>
                    </TabsContent>
                    <TabsContent value="enterprise" className="mt-6 p-6 bg-background rounded-lg border">
                        <h3 className="font-semibold text-xl">Complex Structures, Simplified</h3>
                        <p className="text-muted-foreground mt-2">Manage multiple branches, complex team hierarchies, and granular permissions with our powerful organizational tools, all while getting a unified view of performance.</p>
                    </TabsContent>
                    <TabsContent value="freelancers" className="mt-6 p-6 bg-background rounded-lg border">
                        <h3 className="font-semibold text-xl">Your Business in Your Pocket</h3>
                        <p className="text-muted-foreground mt-2">Track leads, manage projects, and send quotations on the go. LCUZR helps you stay organized and look professional, even as a one-person team.</p>
                    </TabsContent>
                </Tabs>
            </div>
        </section>
    );
};


const testimonials = [
    { name: "Sarah K.", title: "CEO, Innovate Inc.", avatar: "https://placehold.co/100x100.png", dataAiHint: "person face", feedback: "LCUZR has revolutionized how we manage our sales pipeline. The AI insights are a game-changer for our team's productivity." },
    { name: "Ahmed M.", title: "Marketing Director, Solutions Ltd.", avatar: "https://placehold.co/100x100.png", dataAiHint: "person face", feedback: "Finally, a CRM that understands the needs of a modern marketing agency. The team structure and permission controls are top-notch." },
    { name: "Fatima A.", title: "Founder, Growth Co.", avatar: "https://placehold.co/100x100.png", dataAiHint: "person face", feedback: "As a startup, we need tools that can scale with us. LCUZR is powerful yet intuitive. We were up and running in a single afternoon." },
]
const Testimonials = () => {
    const { t } = useTranslation();
    return (
        <section id="testimonials" className="py-20 md:py-28">
            <div className="container mx-auto text-center">
                <h2 className="text-3xl md:text-4xl font-bold">{t('landing.testimonialsTitle')}</h2>
                <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">{t('landing.testimonialsDescription')}</p>
                <Carousel className="w-full max-w-4xl mx-auto mt-12" opts={{ loop: true }}>
                    <CarouselContent>
                        {testimonials.map((testimonial, i) => (
                            <CarouselItem key={i}>
                                <Card className="border-none shadow-none">
                                    <CardContent className="p-6 text-center">
                                        <Avatar className="w-20 h-20 mx-auto mb-4">
                                            <AvatarImage src={testimonial.avatar} alt={testimonial.name} data-ai-hint={testimonial.dataAiHint} />
                                            <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <p className="text-lg italic text-foreground">"{testimonial.feedback}"</p>
                                        <p className="mt-4 font-semibold">{testimonial.name}</p>
                                        <p className="text-sm text-muted-foreground">{testimonial.title}</p>
                                    </CardContent>
                                </Card>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
                </Carousel>
            </div>
        </section>
    );
}


const plans = [
    { name: "Pro", price: 99, yearlyPrice: 99 * 12 * 0.6, features: ["Full CRM Access", "5,000 Leads/Month", "Advanced Reporting", "API Access"], popular: true },
    { name: "Business", price: 249, yearlyPrice: 249 * 12 * 0.6, features: ["Everything in Pro", "10,000 Leads/Month", "Priority Support", "Custom Roles"], popular: false },
]
const Pricing = () => {
    const { t } = useTranslation();
    const [billingCycle, setBillingCycle] = React.useState<'monthly' | 'annually'>('monthly');
    const router = useRouter();
    
    return (
        <section id="pricing" className="py-20 md:py-28 bg-muted/50">
            <div className="container mx-auto text-center">
                <h2 className="text-3xl md:text-4xl font-bold">{t('landing.pricingTitle')}</h2>
                <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">{t('landing.pricingDescription')}</p>
                <div className="flex items-center justify-center gap-4 my-8">
                    <Label htmlFor="billing-cycle" className={cn(billingCycle === 'monthly' ? 'text-primary' : 'text-muted-foreground')}>{t('landing.monthly')}</Label>
                    <Switch
                        id="billing-cycle"
                        checked={billingCycle === 'annually'}
                        onCheckedChange={(checked) => setBillingCycle(checked ? 'annually' : 'monthly')}
                        aria-label="Toggle billing cycle"
                    />
                    <Label htmlFor="billing-cycle" className={cn(billingCycle === 'annually' ? 'text-primary' : 'text-muted-foreground')}>{t('landing.annually')}</Label>
                    <span className="bg-accent/20 text-accent-foreground text-xs font-medium me-2 px-2.5 py-0.5 rounded-full">{t('landing.save')}</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                     <Card className="flex flex-col text-start">
                        <CardHeader><CardTitle>Free</CardTitle><CardDescription>For individuals and small teams just getting started.</CardDescription></CardHeader>
                        <CardContent className="flex-grow space-y-4">
                            <p className="text-4xl font-bold">Free</p>
                            <ul className="space-y-2 text-muted-foreground">
                                <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-500" /> Basic CRM Access</li>
                                <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-500" /> 100 Leads/Month</li>
                                <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-500" /> Community Support</li>
                            </ul>
                        </CardContent>
                        <div className="p-6">
                          <GetStartedButton className="w-full">{t('landing.getStarted')}</GetStartedButton>
                        </div>
                    </Card>
                    {plans.map(plan => {
                         const displayPrice = billingCycle === 'annually' ? (plan.yearlyPrice / 12) : plan.price;
                         return (
                            <Card key={plan.name} className={cn("flex flex-col text-start", plan.popular && "border-primary ring-2 ring-primary")}>
                                <CardHeader>
                                    <div className="flex justify-between items-center">
                                         <CardTitle>{plan.name}</CardTitle>
                                         {plan.popular && <span className="bg-primary text-primary-foreground text-xs font-medium me-2 px-2.5 py-0.5 rounded-full">Most Popular</span>}
                                    </div>
                                    <CardDescription>For growing businesses that need more power and automation.</CardDescription>
                                </CardHeader>
                                <CardContent className="flex-grow space-y-4">
                                     <div className="flex items-baseline gap-2">
                                        <span className="text-4xl font-bold">${displayPrice.toFixed(0)}</span>
                                        <span className="text-muted-foreground">/ month</span>
                                    </div>
                                    {billingCycle === 'annually' && <p className="text-sm text-muted-foreground">Billed as ${plan.yearlyPrice.toFixed(0)} per year</p>}
                                    <ul className="space-y-2 text-muted-foreground">
                                        {plan.features.map(feature => (
                                            <li key={feature} className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-500" /> {feature}</li>
                                        ))}
                                    </ul>
                                </CardContent>
                                <div className="p-6"><Button className="w-full" onClick={() => router.push('/billing')}>Choose {plan.name}</Button></div>
                            </Card>
                         )
                    })}
                </div>
                 <p className="mt-8 text-muted-foreground">
                    <Trans i18nKey="landing.contactEnterprise">
                        Have more than 50 users? <a href="#" onClick={(e) => {e.preventDefault(); router.push('/billing')}} className="text-primary underline">Contact us for our Enterprise plan.</a>
                    </Trans>
                 </p>
            </div>
        </section>
    )
}

const faqItems = [
    { q: "How does the free plan work?", a: "Our free plan gives you access to all the basic CRM features for one user and up to 100 leads per month. It's a great way to get started and see if LCUZR is right for you. You can upgrade at any time." },
    { q: "Who owns my data?", a: "You do. We take data privacy and security very seriously. Your data is your own, and we will never share it with third parties. You can export your data at any time." },
    { q: "Can I add unlimited users?", a: "Our paid plans come with a set number of users. If you need more, you can add them for an additional fee per user. Our Enterprise plan offers custom user limits to fit your needs." },
    { q: "What’s included in the AI features?", a: "Our AI features include lead scoring, performance forecasting, and optimization suggestions. These tools help you prioritize your efforts and make smarter decisions to grow your business." },
];
const FAQ = () => {
    const { t } = useTranslation();
    return (
        <section id="faq" className="py-20 md:py-28">
            <div className="container mx-auto max-w-4xl">
                <h2 className="text-center text-3xl md:text-4xl font-bold">{t('landing.faqTitle')}</h2>
                <Accordion type="single" collapsible className="w-full mt-8">
                    {faqItems.map((item, i) => (
                        <AccordionItem key={i} value={`item-${i}`}>
                            <AccordionTrigger className="text-lg text-start">{item.q}</AccordionTrigger>
                            <AccordionContent className="text-base text-muted-foreground">{item.a}</AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>
        </section>
    );
};

const Footer = () => (
    <footer className="bg-background border-t">
        <div className="container mx-auto py-12 px-4">
             <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
                 <div className="col-span-1 md:col-span-2 space-y-4">
                    <Logo />
                    <p className="text-muted-foreground max-w-xs">The all-in-one CRM for modern, high-performance teams.</p>
                     <div className="flex space-x-4">
                        <Link href="#"><Twitter className="h-5 w-5 text-muted-foreground hover:text-foreground"/></Link>
                        <Link href="#"><Github className="h-5 w-5 text-muted-foreground hover:text-foreground"/></Link>
                        <Link href="#"><Linkedin className="h-5 w-5 text-muted-foreground hover:text-foreground"/></Link>
                    </div>
                </div>
                 <div className="grid grid-cols-2 md:grid-cols-3 col-span-1 md:col-span-3 gap-8">
                    <div>
                        <h4 className="font-semibold mb-3">Product</h4>
                        <ul className="space-y-2">
                             <li><Link href="#features" className="text-muted-foreground hover:text-foreground">Features</Link></li>
                             <li><Link href="#pricing" className="text-muted-foreground hover:text-foreground">Pricing</Link></li>
                             <li><Link href="#" className="text-muted-foreground hover:text-foreground">Book a Demo</Link></li>
                        </ul>
                    </div>
                     <div>
                        <h4 className="font-semibold mb-3">Company</h4>
                        <ul className="space-y-2">
                             <li><Link href="#" className="text-muted-foreground hover:text-foreground">About Us</Link></li>
                             <li><Link href="#" className="text-muted-foreground hover:text-foreground">Careers</Link></li>
                             <li><Link href="#" className="text-muted-foreground hover:text-foreground">Contact</Link></li>
                        </ul>
                    </div>
                     <div>
                        <h4 className="font-semibold mb-3">Legal</h4>
                        <ul className="space-y-2">
                             <li><Link href="#" className="text-muted-foreground hover:text-foreground">Privacy Policy</Link></li>
                             <li><Link href="#" className="text-muted-foreground hover:text-foreground">Terms of Service</Link></li>
                        </ul>
                    </div>
                 </div>
            </div>
             <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
                <p>&copy; {new Date().getFullYear()} LCUZR Inc. All rights reserved.</p>
            </div>
        </div>
    </footer>
);

export default function LandingPage() {
    const { t } = useTranslation();
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
        <Header />
        <main className="flex-grow">
            <Hero />
            <FeaturesSection />
            <DashboardPreview />
            <WhyChooseUs />
            <UseCases />
            <Testimonials />
            <Pricing />
            <FAQ />
        </main>
        <Footer />
        <Button className="fixed bottom-4 end-4 h-14 w-14 rounded-full shadow-lg">
            <MessageCircle className="h-7 w-7"/>
            <span className="sr-only">{t('landing.chat')}</span>
        </Button>
    </div>
  );
}
