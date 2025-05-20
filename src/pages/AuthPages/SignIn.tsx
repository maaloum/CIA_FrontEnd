import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";
import SignInForm from "../../components/auth/SignInForm";

export default function SignIn() {
  return (
    <>
      <PageMeta
        title="Classic Insurance Agency | Tag and Title"
        description="We provide a one-stop solution for Maryland tags, titles, and insurance, offering fast, convenient online services to meet all your vehicle and insurance needs."
      />
      <AuthLayout>
        <SignInForm />
      </AuthLayout>
    </>
  );
}
