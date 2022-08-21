pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./Whitelist.sol";


contract Bunny is ERC721Enumerable, Whitelist {
    using SafeMath for uint256;

    uint256 private tokenId = 1;
    uint256 private giftRemainSupply = 250;

    bool public mintOpened;
    bool public giftOpened;

    //todo set correct url
    string public baseURI = "http://api.bunny.example.com/";

    constructor() ERC721("BunnyNFT", "BNY") {
    }

    function start() external onlyOwner {
        mintOpened = true;
    }

    function setBaseURI(string memory _baseUri) external onlyOwner {
        baseURI = _baseUri;
    }

    function _baseURI() override internal view virtual returns (string memory) {
        return baseURI;
    }

    function giftMint(uint _count) external onlyWhitelisted {
        require(giftOpened, "redeem is not active");
        require(giftRemainSupply >= _count, "invalid count");

        for (uint i = 0; i < _count; i++) {
            _safeMint(_msgSender(), tokenId);
            tokenId++;
        }
        giftRemainSupply = giftRemainSupply.sub(_count);
    }

    function toggleGiftOpened() external onlyOwner {
        giftOpened = !giftOpened;
    }

    function mint(uint256 _count) external payable {
        require(mintOpened, "minting is not started");
        // check if count <= 20
        require(_count <= 20, "max count is 20");
        // check if tx.value is correct
        require(0.01 ether * (_count) <= msg.value, "invalid value");
        // check if total supply is not reaching max total supply after mint
        require(totalSupply().add(_count) <= 9750, "reached max supply");

        for (uint i = 0; i < _count; i++) {
            _safeMint(_msgSender(), tokenId);
            tokenId++;
        }
    }

    function withdraw() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }

}
