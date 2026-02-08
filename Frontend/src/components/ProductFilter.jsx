import React from 'react'
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

const ProductFilter = ({ setSortBy }) => {
    return (
        <div className="flex items-center gap-2">
            <Select onValueChange={(value) => setSortBy(value)}>
                <SelectTrigger 
                    className="w-[180px] bg-card border-border text-foreground focus:ring-primary"
                >
                    <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border shadow-medium">
                    <SelectGroup>
                        <SelectItem 
                            value="highToLow" 
                            className="text-foreground focus:bg-primary focus:text-primary-foreground cursor-pointer"
                        >
                            Price: High To Low
                        </SelectItem>
                        <SelectItem 
                            value="lowToHigh" 
                            className="text-foreground focus:bg-primary focus:text-primary-foreground cursor-pointer"
                        >
                            Price: Low To High
                        </SelectItem>
                    </SelectGroup>
                </SelectContent>
            </Select>
        </div>
    )
}

export default ProductFilter