import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

export default function Component() {
  return (
    <Tabs defaultValue="tab-1">
      <TabsContent value="tab-1">
        <p className="text-muted-foreground p-0 text-center text-xs"></p>
      </TabsContent>
      <TabsContent value="tab-2">
        <p className="text-muted-foreground p-0 text-center text-xs"></p>
      </TabsContent>
      <TabsContent value="tab-3">
        <p className="text-muted-foreground p-0 text-center text-xs"></p>
      </TabsContent>
      <TabsList className="mx-auto flex w-full max-w-xs bg-transparent py-2">
        <TabsTrigger
          value="tab-1"
          className="group flex-1 flex-col p-0 text-xs data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=inactive]:bg-transparent"
        >
          <Badge className="bg-primary group-data-[state=inactive]:bg-muted-foreground mb-1.5 min-w-5 px-1 transition-opacity group-data-[state=inactive]:opacity-50">
            1
          </Badge>
          Editing
        </TabsTrigger>
        <TabsTrigger
          value="tab-2"
          className="group flex-1 flex-col p-0 text-xs data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=inactive]:bg-transparent"
        >
          <Badge className="bg-primary group-data-[state=inactive]:bg-muted-foreground mb-1.5 min-w-5 px-1 transition-opacity group-data-[state=inactive]:opacity-50">
            2
          </Badge>
          Preview
        </TabsTrigger>
        <TabsTrigger
          value="tab-3"
          className="group flex-1 flex-col p-0 text-xs data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=inactive]:bg-transparent"
        >
          <Badge className="bg-primary group-data-[state=inactive]:bg-muted-foreground mb-1.5 min-w-5 px-1 transition-opacity group-data-[state=inactive]:opacity-50">
            3
          </Badge>
          Publish
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
