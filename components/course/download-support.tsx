import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type Props = { href: string };

export const DownloadSupport = ({ href }: Props) => {
  return (
    <Card className="p-4">
      <h4 className="font-medium">Course materials</h4>
      <p className="text-sm text-muted-foreground mt-1">
        PDF / Slides / Resources
      </p>
      <div className="mt-3">
        <a href={href} download>
          <Button size="sm">Download materials</Button>
        </a>
      </div>
    </Card>
  );
};
