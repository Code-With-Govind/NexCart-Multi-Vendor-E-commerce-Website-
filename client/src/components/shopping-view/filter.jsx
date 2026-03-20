import { filterOptions } from "@/config";
import { Fragment } from "react";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { Separator } from "../ui/separator";

function ProductFilter({ filters, handleFilter }) {
  return (
    <div className="bg-white dark:bg-card rounded-2xl shadow-soft border border-border/50 overflow-hidden sticky top-24 max-h-[calc(100vh-8rem)] flex flex-col">
      <div className="p-5 border-b border-border/50 bg-muted/10 shrink-0">
        <h2 className="text-xl font-extrabold text-foreground tracking-tight">Filters</h2>
      </div>
      <div className="p-5 space-y-6 overflow-y-auto custom-scrollbar">
        {Object.keys(filterOptions).map((keyItem) => (
          <Fragment key={keyItem}>
            <div>
              <h3 className="text-sm font-bold text-foreground mb-3 tracking-wider uppercase">{keyItem}</h3>
              <div className="grid gap-3">
                {filterOptions[keyItem].map((option) => (
                  <Label key={option.id} className="flex font-medium items-center gap-3 cursor-pointer group">
                    <Checkbox
                      checked={
                        filters &&
                        Object.keys(filters).length > 0 &&
                        filters[keyItem] &&
                        filters[keyItem].indexOf(option.id) > -1
                      }
                      onCheckedChange={() => handleFilter(keyItem, option.id)}
                      className="border-muted-foreground/30 data-[state=checked]:bg-primary transition-colors group-hover:border-primary/50"
                    />
                    <span className="text-muted-foreground group-hover:text-foreground transition-colors group-hover:translate-x-0.5 transform duration-300">{option.label}</span>
                  </Label>
                ))}
              </div>
            </div>
            <Separator className="bg-border/50" />
          </Fragment>
        ))}
      </div>
    </div>
  );
}

export default ProductFilter;
