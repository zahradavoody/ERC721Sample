pragma solidity ^0.8.0;
import "@openzeppelin/contracts/access/Ownable.sol";

contract Whitelist is Ownable {
    mapping(address => bool) whitelist;

    modifier onlyWhitelisted() {
        require(isWhitelisted(_msgSender()));
        _;
    }

    function addToWhitelist(address _address) public onlyOwner {
        whitelist[_address] = true;
    }

    function removeFromWhitelist(address _address) public onlyOwner {
        whitelist[_address] = false;
    }

    function bulkAddToWhitelist(address[] calldata _addresses) external onlyOwner {
        require(_addresses.length <= 250, "addresses count exceeds limit");
        for (uint256 i = 0; i < _addresses.length; i++) {
            whitelist[_addresses[i]] = true;
        }
    }

    function bulkRemoveFromWhitelist(address[] calldata _addresses) external onlyOwner {
        require(_addresses.length <= 250, "addresses count exceeds limit");
        for (uint256 i = 0; i < _addresses.length; i++) {
            whitelist[_addresses[i]] = false;
        }
    }

    function isWhitelisted(address _address) public view returns (bool) {
        return whitelist[_address];
    }
}
