import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "../ui/spinner";

interface Props {
  onSearch: (username: string) => void;
  isLoading: boolean;
}

export function LookupForm({ onSearch, isLoading }: Props) {
  const [value, setValue] = useState("");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSearch(value.trim().toLocaleLowerCase());
      }}
      className="flex gap-2"
    >
      <Input
        placeholder="Enter PPPoE username"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <Button type="submit" disabled={isLoading}>
        {isLoading ? <Spinner /> : <>Search</>}
      </Button>
    </form>
  );
}
