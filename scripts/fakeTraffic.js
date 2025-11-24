// scripts/fakeTraffic.js
async function simulateTraffic() {
    const pages = ["/", "/blog/my-first-blog-post", "/blog/hello", "/about"];
    const devices = ["web", "mobile"];
    const eventTypes = ["pageview", "click", "post"];
  
    for (let i = 0; i < 10; i++) {
      const randomPage = pages[Math.floor(Math.random() * pages.length)];
      const randomDevice = devices[Math.floor(Math.random() * devices.length)];
      const randomEvent = eventTypes[Math.floor(Math.random() * eventTypes.length)];
  
      try {
        const res = await fetch("http://localhost:5000/api/track", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            eventType: randomEvent,   //  required
            page: randomPage,         //  matches schema
            deviceType: randomDevice, //  matches schema
          }),
        });
  
        const data = await res.json();
        console.log(` Logged ${randomEvent} on ${randomPage} (${randomDevice})`, data);
      } catch (err) {
        console.error("❌ Failed:", err);
      }
    }
  }
  
  simulateTraffic();
  