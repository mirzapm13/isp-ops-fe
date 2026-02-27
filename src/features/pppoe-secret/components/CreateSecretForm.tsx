import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
// import { toast } from "sonner";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
// import {
//   InputGroup,
//   InputGroupAddon,
//   InputGroupText,
//   InputGroupTextarea,
// } from "@/components/ui/input-group";
import { pppoeSecretCreateSchema } from "../pppoeSecret.schema";
import { Checkbox } from "@/components/ui/checkbox";
import { useFetchRouters } from "../hooks/useCreateSecret";
import { useCreateSecret, useFetchProfile } from "@/hooks/useProfile";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";

export default function CreateSecretForm() {
  const { data, isLoading, error } = useFetchProfile("pop-2");
  const createSecretMutation = useCreateSecret();
  const {
    data: routers,
    isLoading: isRoutersLoading,
    error: routersError,
  } = useFetchRouters();

  // const {} = useCreateProfile();

  const { handleSubmit, reset, control } = useForm<
    z.infer<typeof pppoeSecretCreateSchema>
  >({
    resolver: zodResolver(pppoeSecretCreateSchema),
    defaultValues: {
      name: "",
      comment: "",
      password: "",
      profile: "",
      service: "pppoe",
      router: "all",
      disabled: "no",
    },
  });

  function onSubmit(data: z.infer<typeof pppoeSecretCreateSchema>) {
    createSecretMutation.mutate(data, {
      onSuccess: () => {
        reset();
      },
    });
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Create New PPPoE Secret</CardTitle>
      </CardHeader>
      <CardContent>
        <form id="create-secret" onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name="name"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="create-secret-name">
                    Secret Name
                  </FieldLabel>
                  <Input
                    {...field}
                    id="create-secret-name"
                    aria-invalid={fieldState.invalid}
                    placeholder="Name for the secret"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="password"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="create-secret-password">
                    Password
                  </FieldLabel>
                  <Input
                    {...field}
                    id="create-secret-password"
                    placeholder="Password for the secret"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="comment"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="create-secret-comment">
                    Comment
                  </FieldLabel>
                  <Input
                    {...field}
                    id="create-secret-comment"
                    placeholder="Comment for the secret"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="router"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Router</FieldLabel>
                  {isRoutersLoading ? (
                    <Spinner />
                  ) : error ? (
                    <p>Error: {error.message}</p>
                  ) : (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a router" />
                      </SelectTrigger>

                      <SelectContent defaultValue="all">
                        <SelectItem value="all">All Routers</SelectItem>
                        {routers?.map((router) => (
                          <SelectItem key={router.id} value={router.id}>
                            {router.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="profile"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Profile</FieldLabel>
                  {isLoading ? (
                    <Spinner />
                  ) : routersError ? (
                    <p>Error: {routersError.message}</p>
                  ) : (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a profile" />
                      </SelectTrigger>
                      <SelectContent>
                        {data?.map((profile) => (
                          <SelectItem key={profile.id} value={profile.name}>
                            {profile.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="disabled"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <div className="flex items-center gap-3">
                    <FieldLabel htmlFor="create-secret-disabled">
                      Enabled?
                    </FieldLabel>
                    <Checkbox
                      {...field}
                      id="create-secret-disabled"
                      checked={field.value === "no"}
                      onCheckedChange={(checked) =>
                        field.onChange(checked ? "no" : "yes")
                      }
                    />
                  </div>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter>
        <Field className="flex justify-end" orientation="horizontal">
          <Button type="button" variant="outline" onClick={() => reset()}>
            Reset
          </Button>
          <Button type="submit" form="create-secret">
            Submit
          </Button>
        </Field>
      </CardFooter>
      {/* {isLoading && <p>Loading...</p>}
      {error && <p>Error: {error.message}</p>}
      {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
      {isRoutersLoading && <p>Loading routers...</p>}
      {routersError && <p>Error loading routers: {routersError.message}</p>}
      {routers && <pre>{JSON.stringify(routers, null, 2)}</pre>} */}
    </Card>
  );
}
