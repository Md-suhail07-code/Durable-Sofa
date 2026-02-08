import React from 'react';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Ruler, Hammer, ShieldCheck } from "lucide-react";

const TechnicalSpecs = ({ materials, dimensions }) => {
    const formatKey = (key) => key.replace(/([A-Z])/g, ' $1').trim();
    const formatDetail = (value) => {
        if (Array.isArray(value)) return value.join(", ");
        if (typeof value === 'object' && value !== null) return null;
        return value;
    };

    return (
        <div className="mt-16 space-y-8">
            <div className="inline-block border-b-2 border-primary pb-2">
                <h2 className="font-display text-3xl font-semibold text-foreground">Specifications</h2>
            </div>

            <Accordion type="single" collapsible className="w-full border-t border-border">

                {/* 1. DIMENSIONS SECTION */}
                <AccordionItem value="dimensions" className="border-b border-border/50">
                    <AccordionTrigger className="hover:no-underline py-6 group">
                        <div className="flex items-center gap-4 text-left">
                            <div className="p-3 rounded-xl bg-primary/5 group-hover:bg-primary/10 transition-colors">
                                <Ruler className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <p className="text-sm font-bold uppercase tracking-widest text-foreground">Measurements</p>
                                <p className="text-xs text-muted-foreground">Size guide and fit details</p>
                            </div>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="pb-8 px-2">
                        {typeof dimensions === 'string' ? (
                            <div className="bg-muted/30 p-4 rounded-xl border border-border/50">
                                <p className="text-sm font-medium text-foreground">
                                    <span className="text-muted-foreground mr-2 font-normal">Full Dimensions:</span>
                                    {dimensions}
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-2">
                                {dimensions && Object.entries(dimensions).length > 0 ? (
                                    Object.entries(dimensions).map(([key, value]) => (
                                        <div key={key} className="flex justify-between py-3 border-b border-border/20 last:border-0 md:last:border-b">
                                            <span className="text-muted-foreground capitalize text-sm">
                                                {formatKey(key)}
                                            </span>
                                            <span className="font-semibold text-foreground text-sm">{value}</span>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-sm text-muted-foreground italic">Standard measurements apply.</p>
                                )}
                            </div>
                        )}
                    </AccordionContent>
                </AccordionItem>

                {/* 2. MATERIALS SECTION */}
                <AccordionItem value="materials" className="border-b border-border/50">
                    <AccordionTrigger className="hover:no-underline py-6 group">
                        <div className="flex items-center gap-4 text-left">
                            <div className="p-3 rounded-xl bg-primary/5 group-hover:bg-primary/10 transition-colors">
                                <Hammer className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <p className="text-sm font-bold uppercase tracking-widest text-foreground">Composition & Build</p>
                                <p className="text-xs text-muted-foreground">Sustainability and structural details</p>
                            </div>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="pb-8 px-2 space-y-6">
                        <div className="grid grid-cols-1 gap-6">
                            {typeof materials === 'string' ? (
                                <div className="bg-muted/30 p-4 rounded-xl border border-border/50">
                                    <p className="text-sm font-medium text-foreground">{materials}</p>
                                </div>
                            ) : (
                                materials && Object.entries(materials).map(([key, value]) => {
                                    if (typeof value === 'object' && !Array.isArray(value) && value !== null) {
                                        return (
                                            <div key={key} className="bg-muted/30 p-5 rounded-2xl border border-border/50 space-y-3">
                                                <p className="text-xs font-black uppercase text-primary tracking-tighter">Detailed Section: {formatKey(key)}</p>
                                                {Object.entries(value).map(([subKey, subVal]) => (
                                                    <div key={subKey} className="text-sm flex flex-col sm:flex-row sm:gap-2">
                                                        <span className="text-muted-foreground font-medium min-w-[140px]">{formatKey(subKey)}:</span>
                                                        <span className="text-foreground">{formatDetail(subVal)}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        );
                                    }
                                    return (
                                        <div key={key} className="flex flex-col py-1">
                                            <span className="text-xs font-bold uppercase text-primary/70 mb-1 tracking-tight">
                                                {formatKey(key)}
                                            </span>
                                            <span className="text-sm text-foreground leading-relaxed font-medium">
                                                {formatDetail(value)}
                                            </span>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </AccordionContent>
                </AccordionItem>

                {/* 3. WARRANTY & CARE */}
                <AccordionItem value="care" className="border-b border-border/50">
                    <AccordionTrigger className="hover:no-underline py-6 group">
                        <div className="flex items-center gap-4 text-left">
                            <div className="p-3 rounded-xl bg-primary/5 group-hover:bg-primary/10 transition-colors">
                                <ShieldCheck className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <p className="text-sm font-bold uppercase tracking-widest text-foreground">Warranty & Quality</p>
                                <p className="text-xs text-muted-foreground">Guarantee and care guide</p>
                            </div>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="pb-8 px-2 text-sm text-muted-foreground leading-relaxed space-y-4">
                        <p>
                            <span className="text-foreground font-semibold">Quality Standards:</span> All materials are ethically sourced and tested for durability. Solid wood frames come with a 10-year structural warranty.
                        </p>
                        <p>
                            <span className="text-foreground font-semibold">Maintenance:</span> Use a lint roller for velvet surfaces. Keep away from direct sunlight to prevent color fading.
                        </p>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    );
};

export default TechnicalSpecs;