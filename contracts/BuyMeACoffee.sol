//SPDX-License-Identifier: Unlicense

// contracts/BuyMeACoffee.sol
pragma solidity ^0.8.0;

// Example Contract Address on Goerli: 0xa15b4D982766D62291f850a22194349bfe2BF941

contract BuyMeACoffee {
    // Event to emit when a Memo is created.
    event NewMemo(
        address indexed from,
        uint256 timestamp,
        string name,
        string message
    );
    
    // Memo struct.
    struct Memo {
        address from;
        uint256 timestamp;
        string name;
        string message;
    }
    
    address payable public owner;
    address payable public withdrawalAddress;

    // List of all memos received from coffee purchases.
    Memo[] memos;

    constructor() {
        owner = payable(msg.sender);
        withdrawalAddress = owner;
    }

    /**
     * @dev fetches all stored memos
     */
    function getMemos() public view returns (Memo[] memory) {
        return memos;
    }

    /**
     * @dev buy a coffee for owner (sends an ETH tip and leaves a memo)
     * @param _name name of the coffee purchaser
     * @param _message a nice message from the purchaser
     */
    function buyCoffee(string memory _name, string memory _message) public payable {
        // being marked as payable, ETH sent to this function goes to the contract's balance
        // Must accept more than 0 ETH for a coffee.
        require(msg.value > 0, "can't buy coffee for free!");

        // Add the memo to storage!
        memos.push(Memo(
            msg.sender,
            block.timestamp,
            _name,
            _message
        ));

        // Emit a NewMemo event with details about the memo.
        emit NewMemo(
            msg.sender,
            block.timestamp,
            _name,
            _message
        );
    }

    /**
     * @dev send the entire balance stored in this contract to the owner
     */
    function withdrawTips() public {
        require(owner.send(address(this).balance));
    }

    /**
     * @dev changes the withdrawal address. ONLY CONTRACT OWNER can do this
     */
    function changeWithdrawalAddress(address payable _to) external {
        require (msg.sender == owner, "Only contract's owner can change withdrawal address");
        require (_to != address(0x0), "Invalid withdrawal address");
        withdrawalAddress = _to;
    }

    /**
     * @dev Accept 0.003ETH for a 'large coffee'
     */
    function buyLargeCoffee (string calldata _name, string calldata _message) external payable {
        require (msg.value == 3*(10**15), "Large coffee requires exactly 0.003 ETH");
        this.buyCoffee{value:msg.value}(_name, _message);
    }
}