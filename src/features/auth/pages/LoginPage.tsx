import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLogin } from "../auth.queries";
import { useAuth } from "../auth.store";
import { setAccessToken } from "@/lib/api";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { authService } from "../auth.service";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import logo from "/public/calm-logo.png";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";

const schema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

type FormValues = z.infer<typeof schema>;

export function LoginPage() {
  const { setAuth } = useAuth();
  const mutation = useLogin();
  const navigate = useNavigate();
  // const { user } = useAuth();

  const { register, handleSubmit } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: FormValues) => {
    mutation.mutate(data, {
      onSuccess: async (res) => {
        // store refresh token persistently
        localStorage.setItem("refresh_token", res.refresh_token);

        // store access token in memory
        setAccessToken(res.access_token);

        const user = await authService.me();

        setAuth(user, res.access_token);

        // ✅ redirect
        navigate("/", { replace: true });
      },
      onError: async (res) => {
        toast.error(res.message);
      },
    });
  };

  return (
    <div className="flex items-center justify-center h-screen w-screen p-4">
      <Card className="flex flex-col p-10 items-center w-2xl">
        <img
          src={logo}
          alt="Company Logo"
          width={200}
          height={200}
          className="mb-5"
        />
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col space-y-4 w-full"
        >
          <Input
            {...register("username")}
            className="h-12 text-lg"
            placeholder="Username"
          />
          <Input
            className="h-12 text-lg"
            type="password"
            placeholder="Password"
            {...register("password")}
          />
          <Button type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? <Spinner /> : "Login"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
