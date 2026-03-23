import Link from "next/link"
import Image from 'next/image'
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from "lucide-react"

const socialLinks = [
  {
    name: "Facebook",
    Icon: Facebook,
    href: "https://www.facebook.com/share/19bgTA4Asu/",
  },
  {
    name: "Twitter",
    Icon: Twitter,
    href: "https://x.com/OnyeSolar",
  },
  {
    name: "Instagram",
    Icon: Instagram,
    href: "https://www.instagram.com/onyesolar/",
  },
  {
    name: "Youtube",
    Icon: Youtube,
    href: "https://www.youtube.com/@OnyeSolar",
  },
]

const logoSrc = "/images/Onye-Solar_Logo.png"

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="relative w-8 h-8"> 
                <Image 
                  src={logoSrc} 
                  alt="Onye-Solar Logo"
                  fill 
                  style={{ objectFit: "contain" }}
                  sizes="32px"
                />
              </div>
              <span className="text-xl font-bold">Onye-Solar</span>
            </div>
            <p className="text-gray-400 mb-4">
              Leading provider of premium solar energy solutions for residential, commercial and corporate engagements.
            </p>
            
            <div className="flex space-x-4">
              {socialLinks.map(({ name, Icon, href }) => (
                <Link key={name} href={href} target="_blank" rel="noopener noreferrer" aria-label={`Follow us on ${name}`}>
                  <Icon className="w-5 h-5 text-gray-400 hover:text-white transition-colors" />
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Products</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/products?category=solar-panels"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Solar Panels
                </Link>
              </li>
              <li>
                <Link href="/products?category=inverters" className="text-gray-400 hover:text-white transition-colors">
                  Inverters
                </Link>
              </li>
              <li>
                <Link href="/products?category=batteries" className="text-gray-400 hover:text-white transition-colors">
                  Batteries
                </Link>
              </li>
              <li>
                <Link
                  href="/products?category=controllers"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Controllers
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-gray-400 hover:text-white transition-colors">
                  All Products
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-gray-400 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/brand" className="text-gray-400 hover:text-white transition-colors">
                  Our Brands
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-primary" />
                <span className="text-gray-400">+2349068704676</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-primary" />
                <span className="text-gray-400">contactonyesolar@gmail.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-primary" />
                <span className="text-gray-400">N0 3 Brown Close, Brown Junction, Aguda, Surulere, Lagos</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © {currentYear} OnyeSolar. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="/privacy" className="text-gray-400 hover:text-white text-sm transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-gray-400 hover:text-white text-sm transition-colors">
              Terms of Service
            </Link>
            <Link href="/cookies" className="text-gray-400 hover:text-white text-sm transition-colors">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
