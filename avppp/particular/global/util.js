class Util {
    static out_of_bounds(position) {
        if(position.x > windowWidth || position.y > windowHeight) return true;
        else if(position.x < 0 || position.y < 0) return true;
        else return false;
    }

    static getInfoElement() {
        let root = createDiv(`
            <h1 id="AVPPP">A VERY PARTICULAR PARTICLE PLAYGROUND</h1>
            <div id="ShortDesc">
                <p class="BodyText">
                    Welcome to <span style="font-weight: bold">A VERY PARTICULAR PARTICLE PLAYGROUND</span>, a passion project because I'm obsessed with math. 
                    It uses computations <span style="font-style: italic">loosely based</span> on real life equations, with adjustments to fit the project and make it look cool.
                    A neat library this experience utilizes is <a href="https://github.com/Debroskii/panel5">PANEL5</a>, a library I created in parallel to this project to just have fun and
                    make future <a href="https://p5js.org/">p5.js</a> projects easier. You have two objects you'll often interact with, <span style="font-weight: bold">Emitters</span>, and <span style="font-weight: bold">Attractors</span>,
                    which create and/or manipulate particles. Theres a lot of customization oppurtunities, so every scene you make will probably be different.
                </p>
            </div>
            <div id="PanelDesc">
                <p class="BodyText">
                    <span style='font-weight: bold'>Panels</span> are the method that you use to edit and interact with your <span style='font-weight: bold'>Emitters</span> and <span style='font-weight: bold'>Attractors</span>, they are also
                    the main feature of <a href="https://github.com/Debroskii/panel5">PANEL5</a>. Panels have two important areas, the <span style="color: rgb(255, 55, 55)">Title Bar</span>, a region containing buttons and a label, and the <span style="color: rgb(55, 155, 255)">Content Area</span>, a scrollable space that displays stuff.
                    <br><br>
                    You can find more information about the panel and content system when I care to document <a href="https://github.com/Debroskii/panel5">PANEL5</a>, but for now you'll have to try
                    your best to understand how they are implemented by how I used them.
                </p>
                <div id="ExamplePanel">
                    <div id="Panel" class="Panel" data-focused="false" style="position: relative; width: 180px; height: 60px; box-shadow: none; border: var(--panel-border);">
                        <div class="TitleBar" style="border-bottom: var(--panel-border); cursor: move;">
                            <div class="TitleBarActionGroup">
                                <button tabindex="-1" class="TitleBarAction" style="width: 20px; height: 20px;">
                                    <img src="assets/icon/close.png" class="ButtonIcon NonSelectable" style="width: 15px; height: 15px;">
                                </button>
                            </div>
                                <p class="TitleBarTitle NonSelectable">Some Panel</p>
                            <div class="TitleBarActionGroup">
                                <button tabindex="-1" class="TitleBarAction" style="width: 20px; height: 20px;">
                                    <img src="assets/icon/open_lock.png" class="ButtonIcon NonSelectable" style="width: 15px; height: 15px;">
                                </button>
                            </div>
                        </div>
                    <div class="RegistryPanelContent" style="height: 40px; display: flex; justify-content: center; align-items: center;">Some stuff...</div>
                </div>
            </div></div>
            <div id="EmitterDesc">
                <!--<video width="300" height="300" autoplay loop>
                    <source src="assets/video/emitter.mp4" type="video/mp4">
                </video>/--!>
                <img src="assets/image/context_menu.png" style="width: 300px; height: 300px">
                <p class="BodyText">
                    <span style="font-weight: bold">Emitters</span> are the first element you'll interact with, they create, or <span style="font-style: italic">emit</span> particles.
                    To create them, simply right click anywhere on the canvas and select "Create Emitter", or you can press <span style="font-weight: bold">Ctrl + E</span>. 
                    <span style="font-weight: bold">Emitters</span> have the widest range of customization through the edit menu, with modifiable attributes such as particle count, emitting force, color,
                    trails, gradients, fading out, shrinking, twinkling, etc...
                    <br><br>
                    <span style="font-weight: bold">Affectors</span> are the second element you'll interact with, they <span style="font-style: italic">affect</span> the particles around them.
                    Similarly to <span style="font-weight: bold">Emitters</span>, to create an <span style="font-weight: bold">Affectors</span>, you can select "Create Affector" from the context menu,
                    or you can press <span style="font-weight: bold">Ctrl + A</span>. By default, affectors will have 0 force, meaning they won't affect any particles, so you'll have to right click on them
                    to open an edit panel and from there you can change its force (negative force will attract, positive force will repel).
                    <span class='FunFact'>
                    <br><br>
                    Fun Fact: the equations they both use to figure out pixel based forces to apply on particles are derived from real life equations, with only
                    slight modifications for the environment!</span>
                </p>
            </div>
            <div id="ClosingText">Close this panel by clicking the X in the top left corner</div>
        
        `).id("InfoContent")
        return root
    }
}