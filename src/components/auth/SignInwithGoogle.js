import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth, db } from "../auth/Firebase";
import { toast } from "react-toastify";
import { setDoc, doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import googleLogo from "../../assets/icons/google.webp";

function SignInwithGoogle() {
  const navigate = useNavigate();

  async function googleLogin() {
    try {
      console.log("Starting Google login process...");
      const provider = new GoogleAuthProvider();
      
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log("Google sign in successful:", user);

      if (user) {
        try {
          const userRef = doc(db, "Users", user.uid);
          console.log("Checking user document:", user.uid);
          
          const userDoc = await getDoc(userRef);
          
          if (!userDoc.exists()) {
            console.log("Creating new user document");
            const nameParts = user.displayName?.split(" ") || [];
            const userData = {
              email: user.email,
              firstName: nameParts[0] || "",
              middleName: nameParts.length > 2 ? nameParts.slice(1, -1).join(" ") : "",
              lastName: nameParts[nameParts.length - 1] || "",
              photo: user.photoURL,
              college: "",
              leetcode: "",
              createdAt: new Date().toISOString(),
              lastLogin: new Date().toISOString()
            };

            try {
              await setDoc(userRef, userData);
              console.log("New user document created successfully");
              toast.success("Account created successfully!");
              navigate("/datainput");
            } catch (writeError) {
              console.error("Error writing user document:", writeError);
              toast.error("Error creating user profile. Please try again.");
            }
          } else {
            console.log("Existing user found");
            const userData = userDoc.data();
            
            // Update last login
            try {
              await setDoc(userRef, {
                lastLogin: new Date().toISOString()
              }, { merge: true });
              
              if (!userData?.college || !userData?.leetcode) {
                navigate("/datainput");
              } else {
                navigate("/dashboard");
              }
              
              toast.success("Welcome back!");
            } catch (updateError) {
              console.error("Error updating last login:", updateError);
              // Continue with navigation even if update fails
              navigate(!userData?.college || !userData?.leetcode ? "/datainput" : "/dashboard");
            }
          }
        } catch (firestoreError) {
          console.error("Firestore operation failed:", firestoreError);
          // If Firestore fails, still allow login but show warning
          toast.warning("Signed in, but there was an error loading your profile.");
          navigate("/datainput");
        }
      }
    } catch (error) {
      console.error("Google Sign In Error:", {
        code: error.code,
        message: error.message,
        fullError: error
      });
      
      switch (error.code) {
        case 'auth/popup-blocked':
          toast.error("Please allow popups for this website");
          break;
        case 'auth/popup-closed-by-user':
          toast.error("Sign in was cancelled");
          break;
        case 'auth/unauthorized-domain':
          toast.error("This domain is not authorized");
          break;
        default:
          toast.error("Sign in failed. Please try again.");
      }
    }
  }

  return (
    <div className="text-center mt-4">
      <div
        className="cursor-pointer mx-auto w-52 h-12 flex justify-center items-center bg-[#4169e1] border border-gray-300 rounded-lg hover:bg-[#3752b1]"
        onClick={googleLogin}
      >
        <img
          src={googleLogo}
          alt="Google Logo"
          className="object-contain bg-white w-8 h-8 mr-2 rounded-full"
        />
        <span className="text-white font-medium">Sign in with Google</span>
      </div>
    </div>
  );
}

export default SignInwithGoogle;
