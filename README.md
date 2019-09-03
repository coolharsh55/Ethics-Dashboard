
<h2>Form to make ethics applications easier</h2>
<h2>The form contains 8 components, which can be used to build certain areas of the form application</h2>
<h3>This project uses <a href="https://semantic-ui.com/">semantic ui</a> for easy design</h3>
<ul>
    <li>Components:</li>
    <li>Short input answer</li>
    <li>Group of multiple input fields</li>
    <li>Start and end date section</li>
    <li>Number input</li>
    <li>Grouped checkbox elements</li>
    <li>Inline radio fields</li>
    <li>Multiple selection dropdown</li>
</ul>

<h3>This form allows for</h3>
<ul>
    <li>PDF document generation</li>
    <li>JSON generation</li>
    <li>continuation of partially filled in application </li>
</ul>
<a href="https://masons40.github.io/Ethics-Dashboard/">Demo Website</a>

<p>Each component is made up a H4 tag and is followed by an input area such as a DIV or INPUT tag</p>
<h3>Examples:</h3>

<h4>Example of a checkbox Area component</h4>
<p>H4 tag contains the title, also contains a field to allow the user to add more Criteria</p>
<code>
    <h4>Conflicts of Interest</h4>
    <div class="checkBoxArea">
        <div class="checkBoxArea-div">
            <div>
                <input type="checkbox" id="colleagues" name="colleagues">
                <label for="colleagues">Colleagues</label>
            </div>
            <div>
                <input type="checkbox" id="students" name="students">
                <label for="students">Students</label>
            </div>
            <div>
                <input type="checkbox" id="friends" name="friends">
                <label for="friends">Friends</label>
            </div>
            <div>
                <input type="checkbox" id="relatives" name="relatives">
                <label for="relatives">Relatives</label>
            </div>
        </div>
        <div class='field'>
            <div>
                <input type='text' placeholder="Other option">
                <button class="add-checkbox-option" type="button">Add Criteria</button>
            </div>
        </div>
    </div>
</code>

<h4>Example of a number input</h4>
<p>H4 tag contains the title and a normal input of type number, the number is also tested to be positive</p>
<code>
    <h4>Expected total Number</h4>
    <input type='number' style="border:1px solid">
</code>
