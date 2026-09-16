git clone https://github.com/2KRISHNAYADAV/DVAN.AI.git .


How updating GitHub and Vercel works
Local changes are not sent to GitHub automatically. When you edit code on your computer, the changes stay local until you explicitly push them.

How to update GitHub & Vercel: Whenever you make changes locally and want them live on GitHub and dvan-ai.vercel.app, run these 3 commands:

bash
git add .
git commit -m "Describe your changes"
git push origin main
Automatic Vercel Deployment:

Because Vercel is connected to your GitHub repository, as soon as you run git push origin main, Vercel will automatically detect the update, build your project, and update dvan-ai.vercel.app within 1–2 minutes!