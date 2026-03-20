import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter, Youtube, MapPin, Phone, Mail } from "lucide-react";

function Footer() {
    return (
        <footer className="bg-white border-t border-border mt-auto">
            <div className="container mx-auto px-4 md:px-6 py-12 lg:py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">

                    {/* Brand & About */}
                    <div className="flex flex-col gap-4">
                        <Link to="/shop/home" className="flex items-center gap-2">
                            <span className="font-bold text-2xl tracking-tight text-gradient">Lumina</span>
                        </Link>
                        <p className="text-muted-foreground text-sm leading-relaxed mt-2">
                            Discover the latest trends in fashion and electronics. We provide high-quality products to elevate your lifestyle with modern design and premium feel.
                        </p>
                        <div className="flex items-center gap-4 mt-4">
                            <a href="#" className="w-10 h-10 rounded-full bg-muted/50 flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-white transition-colors">
                                <Facebook className="w-5 h-5" />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-muted/50 flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-white transition-colors">
                                <Twitter className="w-5 h-5" />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-muted/50 flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-white transition-colors">
                                <Instagram className="w-5 h-5" />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-muted/50 flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-white transition-colors">
                                <Youtube className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="flex flex-col gap-4">
                        <h3 className="font-bold text-foreground text-lg tracking-tight">Quick Links</h3>
                        <ul className="flex flex-col gap-3">
                            {['About Us', 'Contact', 'FAQ', 'Returns Policy', 'Terms of Service'].map((link) => (
                                <li key={link}>
                                    <Link to="#" className="text-muted-foreground text-sm hover:text-primary transition-colors cursor-pointer group flex items-center gap-2">
                                        <div className="w-1 h-1 rounded-full bg-primary/0 group-hover:bg-primary transition-all" />
                                        {link}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Categories */}
                    <div className="flex flex-col gap-4">
                        <h3 className="font-bold text-foreground text-lg tracking-tight">Categories</h3>
                        <ul className="flex flex-col gap-3">
                            {['Men', 'Women', 'Kids', 'Accessories', 'Footwear'].map((category) => (
                                <li key={category}>
                                    <Link to={`/shop/listing?category=${category.toLowerCase()}`} className="text-muted-foreground text-sm hover:text-primary transition-colors cursor-pointer group flex items-center gap-2">
                                        <div className="w-1 h-1 rounded-full bg-primary/0 group-hover:bg-primary transition-all" />
                                        {category}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div className="flex flex-col gap-4">
                        <h3 className="font-bold text-foreground text-lg tracking-tight">Contact Us</h3>
                        <ul className="flex flex-col gap-4">
                            <li className="flex items-start gap-3">
                                <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                                <span className="text-muted-foreground text-sm">123 Commerce St, Tech District, NexCart City, CA 90210</span>
                            </li>
                            <li className="flex items-center gap-3 group cursor-pointer hover:-translate-y-0.5 transition-transform">
                                <div className="w-8 h-8 rounded-full bg-muted/20 flex items-center justify-center group-hover:bg-primary/20 group-hover:text-primary transition-colors">
                                    <Phone className="h-4 w-4" />
                                </div>
                                <span className="text-muted-foreground text-sm">+1 (555) 123-4567</span>
                            </li>
                            <li className="flex items-center gap-3 group cursor-pointer hover:-translate-y-0.5 transition-transform">
                                <div className="w-8 h-8 rounded-full bg-muted/20 flex items-center justify-center group-hover:bg-primary/20 group-hover:text-primary transition-colors">
                                    <Mail className="h-4 w-4" />
                                </div>
                                <span className="text-muted-foreground text-sm">support@nexcart.com</span>
                            </li>
                        </ul>
                    </div>

                </div>
            </div>

            {/* Bottom bar */}
            <div className="border-t border-border bg-muted/20">
                <div className="container mx-auto px-4 md:px-6 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-muted-foreground text-sm font-medium">
                        &copy; {new Date().getFullYear()} NexCart. All rights reserved.
                    </p>
                    <div className="flex gap-4 items-center">
                        {/* Payment method placeholders */}
                        <div className="h-8 w-12 bg-white rounded border border-border flex items-center justify-center shadow-sm">
                            <span className="text-[10px] font-bold text-gray-400">VISA</span>
                        </div>
                        <div className="h-8 w-12 bg-white rounded border border-border flex items-center justify-center shadow-sm">
                            <span className="text-[10px] font-bold text-gray-400">MC</span>
                        </div>
                        <div className="h-8 w-12 bg-white rounded border border-border flex items-center justify-center shadow-sm">
                            <span className="text-[10px] font-bold text-gray-400">PAYPAL</span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
