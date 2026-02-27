// import { ActiveNoBilling } from "@/components/matchingTable/ActiveNoBilling";
import { ActiveNoBilling } from "@/components/matchingTable/ActiveNoBilling";
import { BillingNoActive } from "@/components/matchingTable/BillingNoActive";
import { DoubleActive } from "@/components/matchingTable/DoubleActive";
// import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  // CardDescription,
  // CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMatchTable } from "@/hooks/useMatchTable";

export default function MatchingTable() {
  const { data, isLoading, error } = useMatchTable();

  return (
    <div className="flex w-full flex-col gap-6">
      <Tabs defaultValue="ActiveNoBilling">
        <div className="overflow-x-auto">
          <TabsList>
            <TabsTrigger
              className="hover:cursor-pointer"
              value="ActiveNoBilling"
            >
              Active tidak di Billing
            </TabsTrigger>
            <TabsTrigger
              className="hover:cursor-pointer"
              value="BillingNoActive"
            >
              Billing tidak di Active
            </TabsTrigger>
            <TabsTrigger className="hover:cursor-pointer" value="DoubleBilling">
              Double Billing
            </TabsTrigger>
            <TabsTrigger className="hover:cursor-pointer" value="DoubleActive">
              Double Active
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="ActiveNoBilling">
          <Card>
            <CardHeader>
              <CardTitle>Active tidak ada di Billing</CardTitle>
              {/* <CardDescription>
                Make changes to your account here. Click save when you&apos;re
                done.
              </CardDescription> */}
            </CardHeader>
            <CardContent className="grid gap-6 overflow-auto">
              {isLoading && <p>Loading…</p>}
              {error && (
                <p className="text-destructive">Could not connect to server </p>
              )}
              {data && <ActiveNoBilling rows={data.active_no_billing.data} />}
              {/* <ActiveNoBilling rows={}/> */}
            </CardContent>
            {/* <CardFooter>
              <Button>Save changes</Button>
            </CardFooter> */}
          </Card>
        </TabsContent>
        <TabsContent value="BillingNoActive">
          <Card>
            <CardHeader>
              <CardTitle>Billing tidak ada di Active</CardTitle>
              {/* <CardDescription>
                Change your password here. After saving, you&apos;ll be logged
                out.
              </CardDescription> */}
            </CardHeader>
            <CardContent className="grid gap-6">
              {data && <BillingNoActive rows={data.billing_no_active.data} />}
            </CardContent>
            {/* <CardFooter>
              <Button>Save password</Button>
            </CardFooter> */}
          </Card>
        </TabsContent>
        <TabsContent value="DoubleBilling">
          <Card>
            <CardHeader>
              <CardTitle>Double Billing</CardTitle>
              {/* <CardDescription>
                Change your password here. After saving, you&apos;ll be logged
                out.
              </CardDescription> */}
            </CardHeader>
            <CardContent className="grid gap-6">
              {data && <BillingNoActive rows={data.double_ip.data} />}
            </CardContent>
            {/* <CardFooter>
              <Button>Save password</Button>
            </CardFooter> */}
          </Card>
        </TabsContent>
        <TabsContent value="DoubleActive">
          <Card>
            <CardHeader>
              <CardTitle>Double Billing</CardTitle>
              {/* <CardDescription>
                Change your password here. After saving, you&apos;ll be logged
                out.
              </CardDescription> */}
            </CardHeader>
            <CardContent className="grid gap-6">
              {data && <DoubleActive rows={data.double_active.data} />}
            </CardContent>
            {/* <CardFooter>
              <Button>Save password</Button>
            </CardFooter> */}
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
