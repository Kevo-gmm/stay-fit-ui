import { User } from "@/states/auth";
import { usePathname, useRouter } from "next/navigation";
import { ComponentType, useEffect, useState } from "react";

const withAuth = <P extends object>(WrappedComponent: ComponentType<P>) => {
  const WithAuthComponent = (props: P) => {
    const router = useRouter();
    const pathname = usePathname();
    const user = User.useUser();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
      const isUnauthenticatedRoute = pathname === "/login" || pathname === "/register";

      if (!user || Object.keys(user).length === 0) {
        if (!isUnauthenticatedRoute) router.push("/login");
        else setIsLoading(false);
      } else {
        if (isUnauthenticatedRoute) {
          return router.push("/");
        }

        setIsLoading(false);
      }
    }, [router, user, pathname]);

    if (isLoading) return <div></div>;

    return <WrappedComponent {...props} />;
  };

  WithAuthComponent.displayName = `WithAuth(${WrappedComponent.displayName || WrappedComponent.name || "Component"})`;

  return WithAuthComponent;
};

export default withAuth;
