import { Card } from '@/components/ui/card';
import { FAQ_SECTIONS } from './faq-page-data';

export const FaqPage = () => (
    <div className="flex flex-col gap-5">
        <div>
            <h1 className="text-xl font-semibold tracking-tight">FAQ</h1>
            <p className="mt-1 text-sm text-muted-foreground">
                Коротко про те, як працює застосунок і з чого почати.
            </p>
        </div>

        {FAQ_SECTIONS.map(section => (
            <Card key={section.title} className="flex flex-col gap-1.5 p-5">
                <h2 className="text-base font-semibold tracking-tight">{section.title}</h2>
                {section.paragraphs.map(paragraph => (
                    <p
                        key={paragraph}
                        className="max-w-2xl text-sm leading-relaxed text-muted-foreground"
                    >
                        {paragraph}
                    </p>
                ))}
            </Card>
        ))}
    </div>
);
