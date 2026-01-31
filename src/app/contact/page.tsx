import { ContactForm } from "@/components/contact-form";
import InteractiveMap from "@/components/interactive-map";
import { Mail, Phone, MapPin, Globe } from "lucide-react";

export default function ContactPage() {
  return (
    <>
      {/* Page Header */}
      <section className="bg-secondary/50 py-16 lg:py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-headline font-bold md:text-5xl text-foreground">
            Join Us in Driving the Energy Transition
          </h1>
          <p className="mt-4 max-w-3xl mx-auto text-lg text-muted-foreground">
            Let us transform your vision into reality with cutting-edge solar solutions that stand the test of time.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 lg:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            
            {/* Contact Form */}
            <div className="bg-secondary/30 p-8 rounded-lg">
                <div className="mb-8">
                  <h2 className="text-3xl font-headline font-bold mb-2">Connect With Us</h2>
                   <p className="text-muted-foreground">Fill out our quick form and our experts will contact you within 24 hours with a customized proposal. You can also request a site visit or a callback.</p>
                </div>
                <ContactForm />
            </div>

            {/* Contact Info and Map */}
            <div className="flex flex-col gap-12">
                <div>
                    <h2 className="text-3xl font-headline font-bold mb-6">Reach Us</h2>
                    <div className="space-y-4">
                        <div className="flex items-start gap-4">
                            <MapPin className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                            <div>
                                <h3 className="font-semibold">Registered Office</h3>
                                <p className="text-muted-foreground">BL-E, 1st Floor, FL-1A, 1997 Rajdanga Main Road, E.K.T, Kolkata, West Bengal, India - 700107</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <Mail className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                            <div>
                                <h3 className="font-semibold">Email</h3>
                                <a href="mailto:info@raquadrantenergy.com" className="text-muted-foreground hover:text-primary transition-colors">info@raquadrantenergy.com</a>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <Phone className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                            <div>
                                <h3 className="font-semibold">Phone</h3>
                                <a href="tel:+918910855185" className="text-muted-foreground hover:text-primary transition-colors block">+91-8910855185</a>
                                <a href="tel:+918017337117" className="text-muted-foreground hover:text-primary transition-colors block">+91-8017337117</a>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <Globe className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                            <div>
                                <h3 className="font-semibold">Website</h3>
                                <a href="https://www.raquadrantenergy.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors block">www.raquadrantenergy.com</a>
                                <a href="https://www.Sun2Solar.in" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors block">www.Sun2Solar.in</a>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-auto">
                  <InteractiveMap />
                </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

    