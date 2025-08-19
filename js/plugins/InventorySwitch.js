/*:
 * Creator: CaptainLegHole 8/4/2024 
 * Feel free to use in whatever. I prefer if you credit me, but its not like I'm gonna know if you don't.
 * If you want to shoot thanks my way just look up my handle, you'll find me. XD
 * 
 * @target MZ
 * @plugindesc Multiple Inventory Management Plugin with Commands to Switch and Display Inventory Contents
 * @help This plugin allows you to have multiple inventories, switch between them, and display their contents.
 * 
 * Inventory names are for reference only; use inventory numbers or names in commands.
 * 
 * @param inventoryCount
 * @text Number of Inventories
 * @type number
 * @desc Specify the number of inventories you want to manage.
 * @default 3
 * 
 * @param inventoryNames
 * @text Inventory Names
 * @type string[]
 * @desc Define the names of the inventories. These names are for reference only and do not affect command usage.
 * 
 * @command switchInventory
 * @text Switch Inventory
 * @desc Switch to another inventory
 * 
 * @arg inventoryId
 * @type string
 * @text Inventory ID or Name
 * @desc Enter the inventory number or name to switch to.
 * 
 * @command showInventory
 * @text Show Inventory
 * @desc Show the contents of a specific inventory
 * 
 * @arg inventoryId
 * @type string
 * @text Inventory ID or Name
 * @desc Enter the inventory number or name to display.
 */

(() => {
    const pluginName = 'InventorySwitch';

    // Parse the plugin parameters
    const parameters = PluginManager.parameters(pluginName);
    const inventoryCount = Number(parameters.inventoryCount || 3);
    const inventoryNames = JSON.parse(parameters.inventoryNames || '[]');

    // Store inventory names globally
    window[pluginName] = {
        inventories: {},
        inventoryMapping: {},
        allInventoryNames: ['default'].concat(inventoryNames),
    };

    // Initialize inventories and inventory mapping
    window[pluginName].allInventoryNames.forEach((name, index) => {
        const id = (index === 0 ? 'default' : (index).toString());
        window[pluginName].inventoryMapping[normalizeName(name)] = id;
        window[pluginName].inventories[id] = [];
    });

    // Current inventory ID, default to 'default'
    let currentInventory = 'default';
    let previousInventory = 'default'; // Store previous inventory

    // Normalize name by converting to lowercase and trimming spaces
    function normalizeName(name) {
        return name.toLowerCase().trim();
    }

    // Ensure each inventory is properly initialized
    function ensureInventory(inventoryId) {
        if (!window[pluginName].inventories[inventoryId]) {
            window[pluginName].inventories[inventoryId] = [];
        }
    }

    // Save current inventory state
    function saveCurrentInventory() {
        ensureInventory(currentInventory);
        window[pluginName].inventories[currentInventory] = [];
        $gameParty.allItems().forEach(item => {
            let type;
            if (DataManager.isItem(item)) {
                type = 'item';
            } else if (DataManager.isWeapon(item)) {
                type = 'weapon';
            } else if (DataManager.isArmor(item)) {
                type = 'armor';
            }
            if (type) {
                window[pluginName].inventories[currentInventory].push({ id: item.id, type: type, amount: $gameParty.numItems(item) });
            }
        });
        console.log(`Saved Inventory [${currentInventory}]:`, window[pluginName].inventories[currentInventory]);
    }

    // Clear all items from the current party inventory
    function clearPartyItems() {
        $gameParty.items().forEach(item => $gameParty.loseItem(item, $gameParty.numItems(item)));
        $gameParty.weapons().forEach(item => $gameParty.loseItem(item, $gameParty.numItems(item)));
        $gameParty.armors().forEach(item => $gameParty.loseItem(item, $gameParty.numItems(item)));
    }

    // Load an inventory state
    function loadInventory(inventoryId) {
        ensureInventory(inventoryId);
        clearPartyItems();
        window[pluginName].inventories[inventoryId].forEach(itemData => {
            let item;
            switch (itemData.type) {
                case 'item':
                    item = $dataItems[itemData.id];
                    break;
                case 'weapon':
                    item = $dataWeapons[itemData.id];
                    break;
                case 'armor':
                    item = $dataArmors[itemData.id];
                    break;
                default:
                    return;
            }
            if (item) {
                $gameParty.gainItem(item, itemData.amount);
            }
        });
        console.log(`Loaded Inventory [${inventoryId}]:`, window[pluginName].inventories[inventoryId]);
    }

    // Display the contents of an inventory
    function showInventoryContents(inventoryId) {
        ensureInventory(inventoryId);
        let message = `Contents of Inventory ${inventoryId}:\n`;

        if (window[pluginName].inventories[inventoryId].length === 0) {
            message += 'No items found.\n';
        } else {
            window[pluginName].inventories[inventoryId].forEach(itemData => {
                let itemName;
                switch (itemData.type) {
                    case 'item':
                        itemName = $dataItems[itemData.id]?.name || `Unknown Item ID ${itemData.id}`;
                        break;
                    case 'weapon':
                        itemName = $dataWeapons[itemData.id]?.name || `Unknown Weapon ID ${itemData.id}`;
                        break;
                    case 'armor':
                        itemName = $dataArmors[itemData.id]?.name || `Unknown Armor ID ${itemData.id}`;
                        break;
                    default:
                        itemName = 'Unknown Item';
                        break;
                }
                message += `${itemName}: ${itemData.amount}\n`;
            });
        }

        // Display the message in game
        $gameMessage.add(message);
        console.log(message); // Log the output for debugging
    }

    // Register the switchInventory command
    PluginManager.registerCommand(pluginName, 'switchInventory', args => {
        const inputId = args.inventoryId || 'default';
        const normalizedId = normalizeName(inputId);
        const inventoryId = window[pluginName].inventoryMapping[normalizedId] || inputId;

        console.log(`Switching inventory to ${inventoryId}`); // Debug log

        // If the inventory ID is '1', treat it as 'default'
        const targetInventoryId = (inventoryId === '1') ? 'default' : inventoryId;

        if (!window[pluginName].inventories[targetInventoryId]) {
            console.error(`Inventory ID or Name "${inputId}" not found.`);
            return;
        }

        // Save the current inventory state
        saveCurrentInventory();

        // Switch to the new inventory
        previousInventory = currentInventory;
        currentInventory = targetInventoryId;

        // Load the new inventory state
        loadInventory(currentInventory);
    });

    // Register the showInventory command
    PluginManager.registerCommand(pluginName, 'showInventory', args => {
        const inputId = args.inventoryId || 'default';
        const normalizedId = normalizeName(inputId);
        const inventoryId = window[pluginName].inventoryMapping[normalizedId] || inputId;

        console.log(`Showing contents of inventory ${inventoryId}`); // Debug log

        // If the inventory ID is '1', treat it as 'default'
        const targetInventoryId = (inventoryId === '1') ? 'default' : inventoryId;

        if (!window[pluginName].inventories[targetInventoryId]) {
            console.error(`Inventory ID or Name "${inputId}" not found.`);
            return;
        }

        // Save the current inventory state
        saveCurrentInventory();

        // Save the current inventory ID
        const previousInventoryId = currentInventory;

        // Load and show the requested inventory
        currentInventory = targetInventoryId;
        loadInventory(currentInventory);
        showInventoryContents(currentInventory);

        // Revert back to the previous inventory
        currentInventory = previousInventoryId;
        loadInventory(currentInventory);
    });

})();
