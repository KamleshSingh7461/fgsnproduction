# FGSN Broadcast Overlay: Branding & Graphics Guide

This guide is for the graphics team to understand how to customize and embed their designs into the live broadcast overlays.

## 1. Asset Directory Structure
All custom graphics should be placed in:
`apps/broadcast-overlay/public/graphics/`

### Recommended Folder Structure
- `/graphics/logos/`: Team and tournament logos (SVG/PNG)
- `/graphics/scorebugs/`: Scoreboard frames and plates
- `/graphics/backgrounds/`: Looping videos or textures for lower thirds
- `/graphics/alerts/`: Specialized assets for Aces, Kills, Goals, etc.

---

## 2. Technical Specifications

| Asset Type | Format | Notes |
| :--- | :--- | :--- |
| **Logos** | SVG | Scalable, lightweight, and crystal clear. |
| **UI Plates** | Transparent PNG | Use 2x or 3x resolution for high-DPI displays. |
| **Motion Plates** | WebM (VP9 + Alpha) | Supports transparency in modern browsers. |
| **Animations** | Lottie (JSON) | Best for complex motion (Aces, Match Points). |

---

## 3. How to Embed Custom Graphics

### CSS Styling (Tailwind)
The overlays use **Tailwind CSS**. You can apply custom utility classes directly to your components.
Example: `className="bg-[url('/graphics/scorebugs/metallic-plate.png')] bg-contain"`

### Keyframe Animations
Custom animations are defined in:
`apps/broadcast-overlay/app/globals.css`

You can add your own keyframes there and apply them using Tailwind classes like `animate-my-custom-transition`.

---

## 4. Integration Examples

### Example: Custom Scorebug Frame
If you provide a frame at `/public/graphics/scorebugs/frame.png`:
```tsx
<div className="relative">
    <img src="/graphics/scorebugs/frame.png" className="absolute inset-0" />
    <div className="relative z-10">
        {/* Live Score Data */}
    </div>
</div>
```

### Example: Full-Screen Alert
For a "Match Point" alert:
```tsx
<div className="animate-scale-up-fade">
    <img src="/graphics/alerts/match-point-bg.png" />
    <span className="text-white font-black">MATCH POINT</span>
</div>
```

---

## 6. Data Positioning & Layout

To place scores and stats accurately over your graphics, we use a **Layered Coordinate System**.

### The Layout Strategy
We treat your graphic as a **Background Layer** and place the live data as **Overlay Layers**. 

1. **Relative Container**: We wrap the graphic in a container marked `relative`.
2. **Absolute Placement**: We place each data point (Score, Set, Timer) using `absolute` positioning. 
3. **Alignment**: We use Tailwind classes to nudge text into the exact pixel position.

### Example: Positioning Scores on a Plate
If your team provides a scoreboard with specific "slots" for the scores:

```tsx
<div className="relative w-[500px] h-[100px]">
    {/* 1. Your Base Graphic */}
    <img src="/graphics/scorebugs/main-plate.png" className="w-full h-full" />

    {/* 2. Home Score (Positioned 40px from left) */}
    <div className="absolute left-[40px] top-[25px] w-[60px] text-center">
        <span className="text-3xl font-bold">{data.score.home}</span>
    </div>

    {/* 3. Away Score (Positioned 40px from right) */}
    <div className="absolute right-[40px] top-[25px] w-[60px] text-center">
        <span className="text-3xl font-bold">{data.score.away}</span>
    </div>
</div>
```

### Tips for the Graphics Team
- **Guidelines**: When sending a graphic, it helps to send a second version with "Red Dots" or "Bounding Boxes" where labels should go.
- **Center vs. Edge**: Let us know if a number should be **Center-Aligned** (common for scores) or **Left-Aligned** (common for player names).
- **Safe Zones**: Ensure your graphics have enough "Internal Padding" so long names don't bleed over the edges of your artwork.

---

## 7. Collaboration Workflow
1. **Design**: Create assets in Figma/After Effects.
2. **Guideline**: (Optional) Provide a screenshot with markers for data placement.
3. **Export**: Save as PNG/SVG/WebM to the `/public/graphics/` folder.
4. **Implementation**: The dev team will write the code to "map" the live scores into your designated slots.
