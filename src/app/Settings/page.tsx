export default function SettingsPage() {

   
  const rows = [
    ["Name", "Đăng Hải"],
    ["Gender", "Not provided"],
    ["Location", "Your location"],
    ["Birthday", "Your birthday"],
    ["Summary", "Tell us about yourself"],
    ["Website", "Your blog, portfolio, etc."],
    ["Github", "Your Github username or url"],
    ["LinkedIn", "Your Linkedin username or url"],
    ["X (Twitter)", "Your X username or url"],
  ];

  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-lg font-semibold mb-4">Basic Info</h2>

        <div className="divide-y divide-divider">
          {rows.map(([label, value]) => (
            <div
              key={label}
              className="flex items-center justify-between py-4"
            >
              <span className="text-sm text-foreground/70 w-40">
                {label}
              </span>

              <span className="text-sm flex-1 text-foreground/60">
                {value}
              </span>

              <button className="text-sm text-primary hover:underline">
                Edit
              </button>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-4">Experience</h2>

        <div className="divide-y divide-divider">
          {["Work", "Education"].map((item) => (
            <div
              key={item}
              className="flex items-center justify-between py-4"
            >
              <span className="text-sm text-foreground/70 w-40">
                {item}
              </span>
              <span className="text-sm flex-1 text-foreground/60">
                Add a {item.toLowerCase()}
              </span>
              <button className="text-sm text-primary hover:underline">
                Edit
              </button>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-4">Skills</h2>

        <div className="flex items-center justify-between py-4">
          <span className="text-sm text-foreground/70 w-40">
            Technical Skills
          </span>
          <span className="text-sm flex-1 text-foreground/60">
            Your skills
          </span>
          <button className="text-sm text-primary hover:underline">
            Edit
          </button>
        </div>
      </section>
    </div>
  );
}
